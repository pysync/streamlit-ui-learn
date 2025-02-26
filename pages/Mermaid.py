import streamlit as st
from streamlit_mermaid import st_mermaid
import streamlit.components.v1 as components

st.title("Mermaid Diagram Example")
st.text("Best for: Sequence Diagrams, Flowcharts, State Diagrams") 

st.header("Simple Call and Response")
mermaid_code = """
sequenceDiagram
    participant User
    participant Server

    User->>Server: Request Data
    activate Server
    Server-->>User: Data Response
    deactivate Server
"""

st_mermaid(mermaid_code)  # Simplest way using streamlit-mermaid


st.header("Asynchronous Message")
mermaid_code = """
sequenceDiagram
    participant Client
    participant MessageQueue

    Client->>MessageQueue: Send Message
    MessageQueue -->> Client: ACK
    Client->>+MessageQueue: Fire and Forget Message
    MessageQueue-->>-Client: ACK
"""

st_mermaid(mermaid_code)  # Simplest way using streamlit-mermaid



st.header("Order Processing Sequence Diagram")
mermaid_code = """
sequenceDiagram
    participant Customer
    participant WebApp
    participant OrderService
    participant PaymentService
    participant InventoryService

    Customer->>WebApp: Place Order
    activate WebApp
    WebApp->>OrderService: Create Order
    activate OrderService
    OrderService->>PaymentService: Process Payment
    activate PaymentService
    PaymentService-->>OrderService: Payment Approved
    deactivate PaymentService
    OrderService->>InventoryService: Check Inventory
    activate InventoryService
    InventoryService-->>OrderService: Inventory Available
    deactivate InventoryService
    OrderService-->>WebApp: Order Confirmation
    deactivate OrderService
    WebApp-->>Customer: Order Received
    deactivate WebApp
"""

st_mermaid(mermaid_code) 



st.header("Database ERD: Customers and Orders")
mermaid_code = """
erDiagram
    CUSTOMER {
        int customer_id PK
        string customer_name
        string customer_email
    }

    ORDER {
        int order_id PK
        int customer_id FK
        date order_date
    }

    CUSTOMER ||--o{ ORDER : places
"""

st_mermaid(mermaid_code) 


st.header("Flowchart with a Loop")
mermaid_code = """
graph TD
    A[Start] --> B[Initialize]
    B --> C{Condition?}
    C -- Yes --> D[Process]
    D --> C
    C -- No --> E[End]
"""

st_mermaid(mermaid_code) 






st.title("Mermaid Diagram Example (using HTML Component)")
components.html(
    f"""
    <div class="mermaid" style="font-size: 1.5em, color: blue;">
        {mermaid_code}
    </div>
    <script src="https://unpkg.com/mermaid@10/dist/mermaid.min.js"></script>
    <script>
      mermaid.initialize({{ startOnLoad: true }});
    </script>
    """,
    height=400,
)

