import sys
sys.path.insert(0, '.')
from app.services.extraction_service import parse_curriculum_structure

raw_text = """Stanley College of Engineering and Technology
Department of Computer Science and Engineering
Semester III Curriculum 2027-28

PCC-CS301 Data Structures and Algorithms Credits: 4 LTP: 3-1-2
Unit 1: Linear Structures - Arrays Stacks Queues Linked Lists
Unit 2: Trees and Graphs - BST AVL Trees BFS DFS Dijkstra
CO1: Analyze complexity of linear and non-linear data structures.
CO2: Design efficient graph traversal algorithms.

Semester IV

PCC-CS402 Database Management Systems Credits: 4 LTP: 3-0-2
Unit 1: Relational Data Model SQL DDL DML Normalization 1NF to BCNF
Unit 2: Transactions ACID Two-Phase Locking B+ Trees Indexing
CO1: Formulate relational SQL queries and normalize database schemas.

Semester V

PCC-CS501 Artificial Intelligence and Machine Learning Credits: 4 LTP: 3-1-2
Unit 1: Supervised Learning Regression Decision Trees SVM Random Forests
Unit 2: Neural Networks Backpropagation CNN Recurrent Neural Networks
CO1: Implement supervised machine learning algorithms using Python.

PEC-CS601 Cloud Computing and Distributed Systems Credits: 3 LTP: 3-0-2
Unit 1: Virtualization IaaS PaaS SaaS AWS Docker Kubernetes
CO1: Deploy scalable applications on public cloud infrastructure.
"""

pages_data = [{"page_number": 1, "text": raw_text, "char_count": len(raw_text)}]
result = parse_curriculum_structure(raw_text, pages_data)
print("Courses extracted : " + str(result["total_courses"]))
print("Topics extracted  : " + str(result["total_topics"]))
print("COs extracted     : " + str(result["total_cos"]))
print("Confidence        : " + str(result["overall_confidence"]) + "%")
for c in result["courses"]:
    print("  Sem" + str(c["semester"]) + " | " + c["code"] + " | " + c["title"][:40] + " | " + str(c["credits"]) + "cr | " + str(len(c["units"])) + " units | " + str(len(c["outcomes"])) + " COs")
print("Extraction status : " + result["extraction_status"])
