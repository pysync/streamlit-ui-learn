import streamlit as st
from PIL import Image
import pandas as pd

from streamlit_elements import dashboard
from streamlit_elements import elements, mui, html

# Set layout
st.set_page_config(page_title="Streamlit Learning", layout="wide")

# Hide Streamlit menu and footer using CSS
hide_streamlit_style = """
    <style>
        #MainMenu {visibility: hidden;} /* Hides the top-right menu */
        footer {visibility: hidden;} /* Hides "Powered by Streamlit" footer */
        header {visibility: hidden;} /* Hides the header */
    </style>
"""
#st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# load data with cache
@st.cache_data
def load_data():
  return pd.DataFrame({"Name": ["Alice", "Bob"], "Age": [25, 30]})

loaded_data = load_data()

with elements("dashboard"):

    # You can create a draggable and resizable dashboard using
    # any element available in Streamlit Elements.

    from streamlit_elements import dashboard

    # First, build a default layout for every element you want to include in your dashboard

    layout = [
        # Parameters: element_identifier, x_pos, y_pos, width, height, [item properties...]
        dashboard.Item("first_item", 0, 0, 2, 2),
        dashboard.Item("second_item", 2, 0, 2, 2, isDraggable=False, moved=False),
        dashboard.Item("third_item", 0, 2, 1, 1, isResizable=False),
    ]

    # Next, create a dashboard layout using the 'with' syntax. It takes the layout
    # as first parameter, plus additional properties you can find in the GitHub links below.

    with dashboard.Grid(layout):
        mui.Paper("First item", key="first_item")
        mui.Paper("Second item (cannot drag)", key="second_item")
        mui.Paper("Third item (cannot resize)", key="third_item")

    # If you want to retrieve updated layout values as the user move or resize dashboard items,
    # you can pass a callback to the onLayoutChange event parameter.

    def handle_layout_change(updated_layout):
        # You can save the layout in a file, or do anything you want with it.
        # You can pass it back to dashboard.Grid() if you want to restore a saved layout.
        print(updated_layout)

    with dashboard.Grid(layout, onLayoutChange=handle_layout_change):
        mui.Paper("First item", key="first_item")
        mui.Paper("Second item (cannot drag)", key="second_item")
        mui.Paper("Third item (cannot resize)", key="third_item")
        
        

# Create tab
tab1, tab2, tab3 = st.tabs(["Home", "Settings", "About"])
with tab1:
  st.header("Home Page")
  
  main, sidebar = st.columns([5, 1])
  with sidebar:
     st.header("Config")
     times = st.number_input("times")
    
     # set data to session stage
     user_input = st.text_input("Enter your key:", value=st.session_state.get("key"))
     if user_input:
       st.session_state["key"] = user_input

      
  with main: 
    # render items table
    items = ["Red", "Green", "Blue"]
    st.table({"Colors": items })
  
  
    # using markdown
    st.write("using markdown")
    for item in items:
      st.write(f"- {item}")
  
    # using data frame
    data = {
      "Fruit": ["Apple", "Banana", "Cherry", "Date", "Elderberry"],
      "Quantity": [10, 20, 15, 5, 12],
      "Price": [0.5, 0.3, 0.2, 1.0, 1.5]
    }
    df = pd.DataFrame(data)
    search = st.text_input("keyword: ")
    if search:
      filtered_df = df[df['Fruit'].str.contains(search, case=False)]
    else:
      filtered_df = df
    st.dataframe(filtered_df)
    
    st.title("Split Data into Two Tables")
    
    df_high_quantity = df[df['Quantity'] > 10]
    df_low_quantity = df[df['Quantity'] <= 10]
    
    # pass size by arr
    col1, col2 = st.columns(2)
    with col1:
      st.write("### Fruits with Quantity Greater than 10")
      st.dataframe(df_high_quantity)
  
    # Display the low quantity table
    with col2: 
      st.write("### Fruits with Quantity 10 or Less")
      st.dataframe(df_low_quantity)
  

with tab2:
  st.header("Settings Tab")

with tab3: 
  st.header("About Me: Dzungntnew")

# write header
st.header("Hi header")
st.subheader("subheader here ")
st.text("just a text")

# widget
name = st.text_input("enter name")
print("this is name")

checked = st.checkbox("display age: ")
if checked:
  age = st.number_input("enter your age")

choiced = st.radio("pick one", ["otion1", "option2", "option3"])
selected = st.selectbox("select one", ["select1", "select2"])
uploaded = st.file_uploader("upload a file")

if uploaded:
  st.write("file uploaded success")
  image = Image.open(uploaded)
  st.image(image, caption="example")


btn = st.button("Result Caluclate")
if btn:
   st.text("clicked")

   if name:
      st.text(f"your name is: {name}")
   if age:
      st.text(f"your age: {age}")
   if choiced: 
      st.text(f"you selected: {choiced}")
   if selected:
      st.text(f"you select from box: {selected}")
