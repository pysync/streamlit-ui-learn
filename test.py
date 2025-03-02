from backend.rag.index import chroma_collection
from backend.rag.crud import insert_doc, update_doc, delete_doc
from backend.rag.index import vector_index

#insert_doc("doc-1", "Test Document 1", "This is a test document for indexing 1")
 
ret = chroma_collection.get()
print(ret)

#vector_index.delete("cf978473-9710-4433-a4a5-8adeceab012c")
#update_doc("doc-1", "Test Document 2", "This is a test document for indexing 2")
#ret = chroma_collection.get()
#print(ret)



