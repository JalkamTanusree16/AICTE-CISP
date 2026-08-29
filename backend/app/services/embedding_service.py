import numpy as np

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine_similarity
except ImportError:
    TfidfVectorizer = None
    sklearn_cosine_similarity = None

_ST_MODEL = None
_ENGINE_NAME = "TF-IDF + Cosine Similarity Engine"

# Load SentenceTransformer model once at module initialization
try:
    from sentence_transformers import SentenceTransformer
    _ST_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    _ENGINE_NAME = "SentenceTransformer (all-MiniLM-L6-v2)"
except Exception as e:
    _ST_MODEL = None
    _ENGINE_NAME = "TF-IDF + Cosine Similarity Engine"


class EmbeddingService:
    """
    Production-ready Embedding Service wrapper for SentenceTransformer ('all-MiniLM-L6-v2')
    with TF-IDF cosine similarity fallback. Loaded once at startup and reused.
    """
    def __init__(self):
        self.model = _ST_MODEL
        self.engine_name = _ENGINE_NAME

    def get_embedding_engine_info(self) -> dict:
        return {
            "engine": self.engine_name,
            "is_sentence_transformer": self.model is not None,
            "model_name": "all-MiniLM-L6-v2" if self.model else "TF-IDF Fallback"
        }

    def encode(self, text: str) -> np.ndarray:
        """
        Encodes a single text string into a vector embedding array.
        """
        if not text or not text.strip():
            return np.zeros(384 if self.model else 100)
        
        if self.model is not None:
            try:
                return self.model.encode(text)
            except Exception:
                pass
        
        return np.zeros(384)

    def similarity(self, text1: str, text2: str) -> float:
        """
        Calculates semantic cosine similarity between two text strings dynamically.
        Returns float score between 0.0000 and 1.0000.
        """
        if not text1 or not text2:
            return 0.0

        t1 = text1.strip().lower()
        t2 = text2.strip().lower()

        if t1 == t2:
            return 1.0

        if self.model is not None:
            try:
                embeddings = self.model.encode([text1, text2])
                emb1 = embeddings[0].reshape(1, -1)
                emb2 = embeddings[1].reshape(1, -1)
                sim = sklearn_cosine_similarity(emb1, emb2)[0][0]
                return round(float(max(0.0, min(1.0, sim))), 4)
            except Exception:
                pass

        # TF-IDF Fallback
        if TfidfVectorizer is not None and sklearn_cosine_similarity is not None:
            try:
                vectorizer = TfidfVectorizer(stop_words="english")
                tfidf = vectorizer.fit_transform([text1, text2])
                sim = sklearn_cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
                return round(float(max(0.0, min(1.0, sim))), 4)
            except Exception:
                pass

        # Keyword Overlap Fallback
        w1 = set(t1.split())
        w2 = set(t2.split())
        if not w1 or not w2:
            return 0.0
        return round(len(w1.intersection(w2)) / float(len(w1.union(w2))), 4)

    def batch_similarity(self, source_texts: list[str], reference_texts: list[str]) -> list[list[float]]:
        """
        Calculates pairwise cosine similarity matrix between N source texts and M reference texts.
        """
        if not source_texts or not reference_texts:
            return []

        if self.model is not None and sklearn_cosine_similarity is not None:
            try:
                src_emb = self.model.encode(source_texts)
                ref_emb = self.model.encode(reference_texts)
                sim_matrix = sklearn_cosine_similarity(src_emb, ref_emb)
                return [[round(float(max(0.0, min(1.0, val))), 4) for val in row] for row in sim_matrix]
            except Exception:
                pass

        # Fallback item-by-item computation
        result = []
        for src in source_texts:
            row = [self.similarity(src, ref) for ref in reference_texts]
            result.append(row)
        return result


# Singleton Service Instance
embedding_service = EmbeddingService()

# Backward-compatible functional exports
def compute_similarity(text1: str, text2: str) -> float:
    return embedding_service.similarity(text1, text2)

def get_embedding_engine_info() -> dict:
    return embedding_service.get_embedding_engine_info()
