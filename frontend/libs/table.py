import streamlit as st
from typing import List, Dict, Callable

def build_table(
    data: List[Dict],  # List of objects with schema {id, title, description, created_at}
    fields: List[str],  # List of fields to display (e.g., ["id", "title", "description", "created_at"])
    total: int,  # Total number of items
    page: int,  # Current page number
    limit: int,  # Number of items per page
    options: Dict[str, Callable],  # Available actions (e.g., delete, undo, create, onClick)
    handle_page_change: Callable[[int], None],  # Callback for page change
):
    """
    Renders a data table with pagination, multi-select rows, and actions using default Streamlit components.
    """
    # Calculate total pages
    total_pages = (total + limit - 1) // limit

    # Initialize session state for selected IDs and checkbox states
    if "selected_ids" not in st.session_state:
        st.session_state.selected_ids = set()
    if "checkbox_states" not in st.session_state:
        st.session_state.checkbox_states = {}

    # Initialize checkbox states for each item
    for item in data:
        if item["id"] not in st.session_state.checkbox_states:
            st.session_state.checkbox_states[item["id"]] = False

    # Update selected_ids based on checkbox states
    st.session_state.selected_ids = {
        item_id for item_id, checked in st.session_state.checkbox_states.items() if checked
    }

    # Default logic for checkbox selection
    def handle_select_all(checked: bool):
        for item in data:
            st.session_state.checkbox_states[item["id"]] = checked

    def handle_select_item(item_id: int, checked: bool):
        st.session_state.checkbox_states[item_id] = checked

    # Default logic for New action
    def handle_new():
        st.write("Debug: New action triggered")

    # Default logic for row click
    def handle_row_click(item_id: int):
        st.write(f"Debug: Row clicked with ID: {item_id}")

    # Merge default logic with user-provided options
    options = {
        "delete": lambda ids: st.write(f"Debug: Delete action triggered for IDs: {ids}"),
        "undo": lambda ids: st.write(f"Debug: Undo action triggered for IDs: {ids}"),
        "action_create": handle_new,
        "onClick": handle_row_click,
        **options,  # Override defaults with user-provided options
    }

    # Toolbar with actions
    col1, col2, col3 = st.columns([5, 1, 1])
    with col1:
        if st.button("New", key="new_button"):
            options["action_create"]()
    with col2:
        if st.button("Delete", key="delete_button", disabled=len(st.session_state.selected_ids) == 0):
            options["delete"](list(st.session_state.selected_ids))
    with col3:
        if st.button("Undo", key="undo_button", disabled=len(st.session_state.selected_ids) == 0):
            options["undo"](list(st.session_state.selected_ids))

    # Table with checkboxes for multi-select
    with st.container():
        # Header row with select-all checkbox
        cols = st.columns([1] + [1] + [3] * (len(fields) - 2) + [2] + [2])
        with cols[0]:
            select_all = st.checkbox(
                "",
                key="select_all",
                value=all(st.session_state.checkbox_states.values()),
                on_change=handle_select_all,
                args=(not all(st.session_state.checkbox_states.values()),)
            )

        # Display column headers
        for i, field in enumerate(fields):
            with cols[i + 1]:  # Skip the first column (checkbox)
                st.write(f"**{field.capitalize()}**")
        with cols[-1]:
            st.write(f"**Actions**")

        # Display rows with checkboxes
        for item in data:
            cols = st.columns([1] + [1] + [3] * (len(fields) - 2) + [2] + [2])
            with cols[0]:
                selected = st.checkbox(
                    "",
                    key=f"select_{item['id']}",
                    value=st.session_state.checkbox_states[item["id"]],
                    on_change=handle_select_item,
                    args=(item["id"], not st.session_state.checkbox_states[item["id"]],)
                )

            # Display item fields
            for i, field in enumerate(fields):
                with cols[i + 1]:  # Skip the first column (checkbox)
                    st.write(item.get(field, ""))
            # Row click action
            with cols[-1]:
                if st.button("...", key=f"view_{item['id']}"):
                    options["onClick"](item["id"])

    # Pagination controls
    col1, col2, col3 = st.columns([1, 5, 1])
    with col1:
        if st.button("Previous", disabled=page <= 1):
            handle_page_change(page - 1)  # Call the page change callback
    with col2:
        st.write(f"Page {page} of {total_pages}")
    with col3:
        if st.button("Next", disabled=page >= total_pages):
            handle_page_change(page + 1)  # Call the page change callback

# Example usage
if __name__ == "__main__":
    # Sample data
    data = [
        {
            "id": 1,
            "title": "Item 1",
            "description": "Description for item 1",
            "created_at": "2023-10-01",
        },
        {
            "id": 2,
            "title": "Item 2",
            "description": "Description for item 2",
            "created_at": "2023-10-02",
        },
    ]

    # Fields to display
    fields = ["id", "title", "description", "created_at"]

    # Options for actions (can override defaults)
    options = {
        "delete": lambda ids: st.write(f"Custom Delete action for IDs: {ids}"),
    }

    # Initialize session state for pagination
    if "page" not in st.session_state:
        st.session_state.page = 1

    # Callback function for page change
    def handle_page_change(new_page: int):
        st.write(f"Debug: Page changed to {new_page}")
        # Here, you can call an API to fetch new data for the page
        st.session_state.page = new_page  # Update the page in session state

    # Render the table
    build_table(
        data=data,
        fields=fields,
        total=10,  # Total items
        page=st.session_state.page,  # Current page
        limit=5,  # Items per page
        options=options,
        handle_page_change=handle_page_change,  # Pass the page change callback
    )