from llama_index.core import get_response_synthesizer
from llama_index.core.retrievers import (
    BaseRetriever,
    VectorIndexRetriever,
    KeywordTableSimpleRetriever,
)
from llama_index.core.query_engine import RetrieverQueryEngine
from backend.rag.index import vector_index

def get_query_engine(similarity_top_k: int = 3, filters: list = None) -> RetrieverQueryEngine:
    """
    Creates and returns a RetrieverQueryEngine based on the vector index.
    You can pass optional parameters like similarity_top_k or filters.
    """
    retriever = VectorIndexRetriever(
        index=vector_index,
        similarity_top_k=similarity_top_k,
        vector_store_query_mode="default",
        filters=filters,
        alpha=None,
        doc_ids=None,
    )
    query_engine = RetrieverQueryEngine(
        retriever=retriever,
        response_synthesizer=get_response_synthesizer(response_mode="tree_summarize",)
    )
    return query_engine

query_engine = get_query_engine(similarity_top_k=3)