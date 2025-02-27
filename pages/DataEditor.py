import streamlit as st
import pandas as pd

def load_data():
    # In a real application, this would load from your database
    # For this example, we'll create a sample DataFrame
    data = {'table_name': ['users', 'products', 'orders', 'customers'],
            'description': ['User accounts', 'Product details', 'Customer orders', 'Customer information'],
            'row_count': [1000, 500, 2000, 800]}
    df = pd.DataFrame(data)
    return df

def main():
    st.title("Database Schema Table Editor")

    # Load initial data
    df = load_data()

    # Make dataframe editable
    edited_df = st.data_editor(
        df,
        column_config={
            "table_name": st.column_config.Column(
                "Table Name",
                help="Name of the table",
                width="medium",
                required=True,
            ),
            "description": st.column_config.Column(
                "Description",
                help="Description of the table",
                width="large",
            ),
            "row_count": st.column_config.Column(
                "Row Count",
                help="Number of rows in the table",
                width="small"
            ),
        },
        num_rows="dynamic",
        key="data_editor",
    )

    selected_rows = st.session_state["data_editor"].get("selected_rows", [])

    if selected_rows:
        if st.button("Delete Selected Rows"):
            # Delete rows from dataframe
            edited_df = edited_df.drop(selected_rows)
            st.success("Rows deleted successfully!")


    # Display the updated DataFrame
    st.subheader("Updated Table")
    st.dataframe(edited_df)

    # Optional: Function to save changes back to the database
    # def save_to_database(df):
    #     # Replace with your database connection and update logic
    #     # Example:
    #     # engine = create_engine('your_database_connection_string')
    #     # df.to_sql('your_table_name', engine, if_exists='replace', index=False)
    #     st.write("Saving to database (implementation needed)")
    #
    # if st.button("Save Changes to Database"):
    #     save_to_database(edited_df)


if __name__ == "__main__":
    main()