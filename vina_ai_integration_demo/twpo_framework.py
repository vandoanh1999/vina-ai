import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import cosine_distances
from sklearn.neighbors import kneighbors_graph
from scipy.sparse.csgraph import laplacian
from scipy.optimize import minimize
from ot import sliced_wasserstein_distance

# ======================================================
# TWP-Ω: TruthWeave Omega Framework
# ======================================================

class TWPOmega:
    def __init__(self, d_low=50, k_slices=100):
        self.d_low = d_low
        self.k_slices = k_slices
        self.pca = PCA(n_components=d_low)
        self.trained = False
        self.z_bank = []

    def _distill(self, embeds):
        X = np.vstack(embeds)
        if not self.trained:
            self.pca.fit(X)
            self.trained = True
        return self.pca.transform(X)

    def _cross_weave_align(self, z_list):
        z_c = np.mean(z_list, axis=0)
        aligned = []
        for z in z_list:
            swd = sliced_wasserstein_distance(
                z.reshape(1, -1), z_c.reshape(1, -1), n_projections=self.k_slices
            )
            aligned.append(z + (z_c - z) / (1 + swd))

        # Convert list to numpy array for graph construction
        Z_aligned = np.vstack(aligned)

        # Build graph on the set of aligned embeddings, not just the average
        # n_neighbors must be less than n_samples (which is len(Z_aligned))
        n_samples = len(Z_aligned)
        n_neighbors = max(1, min(n_samples - 1, 2)) # Ensure n_neighbors < n_samples

        if n_samples > 1:
            knn = kneighbors_graph(Z_aligned, n_neighbors=n_neighbors).toarray()
            L = laplacian(knn, normed=False)

            # Apply smoothing to all aligned vectors
            Z_smoothed = Z_aligned + 0.1 * (L @ Z_aligned)
            z_final = np.mean(Z_smoothed, axis=0)
        else:
            z_final = Z_aligned.flatten()

        self.z_bank.append(z_final)
        return z_final

    def _counterfactual(self, z_weave, z_c):
        def loss_fn(delta):
            return np.linalg.norm((z_weave + delta) - z_c) + 0.01 * np.linalg.norm(delta, 1)
        res = minimize(loss_fn, np.zeros_like(z_weave), method="L-BFGS-B")
        return res.x, res.fun

    def process(self, embeds):
        embeds = normalize(np.vstack(embeds))
        z_list = self._distill(embeds)
        z_weave = self._cross_weave_align(z_list)
        z_c = np.mean(z_list, axis=0)
        delta, risk = self._counterfactual(z_weave, z_c)
        cos_dist = cosine_distances(z_list)
        entropy = np.mean(np.std(cos_dist))
        confidence = float(np.clip(1 - (entropy + risk) / 2, 0, 1))
        return z_weave, confidence, delta
