# CLAUDE.md - Project Guide

## Run Commands
- Backend: `uvicorn backend.app:app --reload` ( main backend app in python and fast api)
- Frontend: `streamlit run app.py` ( only use for quick create draft ui and test AI code in streamlit)
- SD-Tool UI: `cd sd-tool-ui && npm start` ( real frontend project with reactjs)

## Test Commands
- Run all tests: `pytest backend/tests/`
- Run specific test: `pytest backend/tests/test_workspace_apis.py::test_create_workspace -v`
- Run tests with coverage: `pytest --cov=backend backend/tests/`

## Code Style Guidelines
1. **Imports**: Standard lib → Third-party → Internal; use absolute imports
2. **Naming**: snake_case for files/functions, PascalCase for classes, UPPER_CASE for constants
3. **Formatting**: 4 spaces indentation, reasonable line length, logical section breaks
4. **Type hints**: Use throughout code with typing module (Optional, List, Dict, etc.)
5. **Error handling**: Use try/except blocks with specific exceptions
6. **Documentation**: Docstrings with triple quotes, comments for complex logic
7. **API structure**: RESTful design, clear endpoints, pagination for lists

## Database Operations
- Use SQLModel Session with context managers
- Consistent CRUD patterns with commit/refresh
- Rollback on exceptions

## Project Overview (Spect)
I building a software development tools - mainly use for first harf-phases in SDLC, that include 

(1) requirement design ( RD ) should output:  software  requirement spect - SRS document 
(2) basic design (BD)  should output: related BD documents, for example: screen list, function list,
 database table schema list and detail, API list, batch list , sequence diagram, .. etc..
(3) detail design (DD): output should is detailed of BD, and use ready for code.

As workflow, 
- first screen when start up, should show list of Workspace, screen also have CRUD action
- when user select one, will load screen Working Space -> that screen is Main App 
( like Slack, when user go one workspace - slackchannel, every things , function can do be in that Working Space)
- Working Space should be design for easy work. in this working space, bellow data is center:

1. Artifact, that is abstraction data with type is: Note, Document, Basic Design, Detail Design, API List, Screen List every things.
2. To create Artifact, user can press button New then show Popup to enter info detail or upload file 
3. Artifact is core data of system, so every tools in that workspace is working on that 
4. When first go Working space, we should see on tab: is free note -> that allow user quick note ( = default artifact note)
At sidebar will display list of current artifact have in working space.
5. in main screen (right content), let's have tabs: note -> copilot ai (chat) -> screen maps -> api list ->.. so on.
that top tabs can scroll to acess more tab. and can close.


- system will have first screen is free note and chat to interactive with system
- have side bar, and can upload related to project files -> after upload use as context.
- then have multi tabs, to switch between screen that work with above output.
as a user, first step is upload current have documents ( maybe requirement draft, or some flexible BD documents...) 
then, ask AI explain overview current document have.
then, user will working with note and pass to AI ask to generate screen list, API list, DB schema , some diagram... 
Or, user can go specific above tabs, and ask user to generate ( or use button) to "re-generate from context".
generated output should be display readltime in  ( table, dataframe). and user can interactive edit and save. saved data should boadcast update all system, it's mean if you change one feature name at SRS tab, then go screen list or function list we will can as to re-generate and update with data changed at SRS tab, and so on.
finally  after document generated, output should be store in raw markdown files in output folder.
and the next session, if user continue work in, the current state should be restore and can continue work with same context ( it's mean, final generated content should be use as last context)


== Out Techstack as bellow ==
1. UI/UX: use material ui and reactjs for development
2. For backend api: use fast api
3. For AI: 
+ llama_index.llms.ollama, llama_index.embeddings.ollama  to work with local LLM
4. For DB vector:
+ llama_index.core VectorStoreIndex, StorageContext, SimpleDirectoryReader for load and work with db vector 
5. For chat:
+ llama_index.core.memory ChatMemoryBuffer, chat_engine.chat to ask and get response 

== UI /UX and Worfollow Consider ==
UI/UX Considerations:

Clean Layout: The WorkspacePage provides a good starting point for a clean and organized layout:
Left sidebar for navigation (artifacts).
Top tabs for switching between main views.
Main content area for displaying the selected view.
Artifact Display:
Use ArtifactCard.tsx to display individual artifacts.
Consider using a grid layout for ArtifactList.tsx.
Implement filtering and sorting options for artifacts.
"New" Artifact Creation: A Material UI Dialog is a good choice for the "New Artifact" popup.
Use a form with appropriate input fields for the artifact type.
Consider using a rich text editor (e.g., Quill, Draft.js) for the artifact content.
AI Copilot Chat: Use a separate component for the AI chat interface.
Consider using a library like react-chat-window or building your own chat interface.
Implement a mechanism to send artifact content to the AI and display the AI's responses.
Screen Maps and API List:
These sections will likely require custom components to display the data in a meaningful way.
Consider using libraries like react-flow for screen maps and react-table for API lists.
Accessibility: Use Material UI components correctly to ensure accessibility. Provide proper labels for form elements. Use ARIA attributes where necessary.
Responsiveness: Use Material UI's responsive grid system to ensure the application looks good on different screen sizes.

# == CORE APP: WorkingSpacePage Spect ==

Let's refine the workflow and screen layouts for your `WorkingSpacePage` in JavaScript, focusing on steps 1-3 of the SDLC with your AI-first approach.

**1. Workflow Analysis within `WorkingSpacePage`**

The `WorkingSpacePage` is your main application area, and the workflow within it will guide users through the initial SDLC phases. Here's a breakdown of the workflow as tabs within this page, aligning with your steps:

*   **Tab 1: Project Plan (Step 1 - Idea & Backlog)**
    *   **Purpose:**  Brainstorm initial ideas, capture project scope, and create a preliminary product backlog.
    *   **Workflow:**
        1.  **Freeform Idea Capture:** User starts in a Markdown editor, jotting down initial ideas, project vision, and notes.
        2.  **Draft Wireframing:** User switches to an embedded Excalidraw to create draft wireframes of key screens or flows based on initial ideas.
        3.  **Backlog Creation (Initial):**  From the Markdown notes and wireframes, the user starts to identify key features and tasks, adding them as cards to a Kanban-style backlog.
        4.  **AI Assistance:** At any point:
            *   User can select text in the Markdown editor or elements in Excalidraw and use context menus to:
                *   "Ask AI to elaborate on this idea."
                *   "Ask AI to suggest backlog items from this text/diagram."
                *   "Ask AI to generate a wireframe based on this text."
            *   "AI Gen/Improve" button at the top of the tab to generate initial project ideas or refine existing notes.
    *   **Output:** Initial Idea Notes (Markdown Artifact), Draft Wireframes (Excalidraw Artifact), Initial Product Backlog (Data within the system).

*   **Tab 2: Requirements (Step 2 - SRS Development)**
    *   **Purpose:** Transform initial ideas into detailed, structured requirements and develop the Software Requirements Specification (SRS) document.
    *   **Workflow:**
        1.  **SRS Document Authoring:** User works in a more structured Markdown editor, perhaps with pre-defined SRS sections (Introduction, Goals, Functional/Non-Functional Requirements, etc.). They refine the initial ideas from "Project Plan" tab and elaborate on them.
        2.  **Requirement Breakdown & Categorization:** User breaks down broad requirements into more granular functional and non-functional requirements. They categorize and tag requirements (e.g., "Functional," "Performance," "Security").
        3.  **Link to Backlog:** User links specific requirements to backlog items created in the "Project Plan" tab, establishing traceability.
        4.  **AI Assistance:**
            *   Context menus within the SRS editor to:
                *   "Ask AI to refine this requirement for clarity."
                *   "Ask AI to identify potential non-functional requirements related to this functional requirement."
                *   "Make this text a Functional Requirement" / "Non-Functional Requirement" (automatically structure and tag).
            *   "AI Gen/Improve SRS Section" button to generate or expand specific sections of the SRS.
            *   "AI Suggest Requirements from Project Plan Notes": AI analyzes notes from the "Project Plan" tab and suggests potential requirements.
    *   **Output:** SRS Document (Markdown Artifact), Structured Requirements List (Data within the system, potentially displayed in a table).

*   **Tab 3: Basic Design (Step 3 - High-Level Design)**
    *   **Purpose:** Translate detailed requirements into basic design artifacts like screen maps, API lists, database schema, and high-level diagrams.
    *   **Workflow:**
        1.  **Screen Map Design:** User utilizes an interactive diagramming tool (like react-flow) to create screen flow diagrams, visualizing the user interface flow.
        2.  **API List Definition:** User starts defining the API endpoints, methods, and basic request/response structures, possibly in a table format.
        3.  **Database Schema (ER Diagram):** User uses an ER diagram tool (or text-based Mermaid) to design the database schema, defining entities and relationships.
        4.  **Diagram Creation (Sequence, Activity, System Overview):** User creates other necessary diagrams (sequence, activity, system context) using diagramming tools or text-based definitions.
        5.  **Link to Requirements & Functions:** User links design artifacts (screens, APIs, entities) back to specific requirements from the "Requirements" tab and potentially to functions identified earlier.
        6.  **AI Assistance:**
            *   "AI Suggest Screen Flow from Requirements": AI analyzes requirements and suggests a screen flow diagram.
            *   "AI Generate API List from Requirements": AI suggests API endpoints and structures based on functional requirements.
            *   "AI Suggest Database Schema from Core Entities": AI proposes a database schema based on identified entities and relationships.
            *   "AI Generate Diagram (Sequence, Activity, System Overview)": AI generates initial diagrams based on requirements and design elements.
            *   Context menus within design tools to:
                *   "Ask AI to refine this screen design for usability."
                *   "Ask AI to suggest API parameters for this endpoint."
                *   "Ask AI to optimize this database entity."
    *   **Output:** Screen Maps (Diagram Artifact), API List (Data/Table Artifact), ER Diagram (Diagram Artifact), Core Entities List (Data/Table Artifact), Sequence/Activity/System Overview Diagrams (Diagram Artifacts).

**2. Screen Maps for `WorkingSpacePage` Tabs**

Here's a textual representation of the screen layout for each tab within `WorkingSpacePage`:

**Tab 1: Project Plan**

```
------------------------------------------------------------------
| AppBar: Workspace Title | Project Plan Tab (Active) | ... Tabs |
------------------------------------------------------------------
| Drawer (Artifact List) |  ------------------------------------- |
|                          |  [Toolbar: "AI Gen/Improve" Button]   |
|                          |  ------------------------------------- |
|                          |  [Split Pane Layout]                 |
|                          |  |-------------------|-----------------|
|                          |  | Left Pane:        | Right Pane:       |
|                          |  | [Markdown Editor] | [Excalidraw]      |
|                          |  |  (Idea Notes)     | (Wireframes)      |
|                          |  |-------------------|-----------------|
|                          |  ------------------------------------- |
|                          |  [Project Backlog (Kanban Board) - Below Split Pane, or separate tab within this main tab if space is tight] |
------------------------------------------------------------------
```

**Tab 2: Requirements**

```
------------------------------------------------------------------
| AppBar: Workspace Title | Requirements Tab (Active) | ... Tabs |
------------------------------------------------------------------
| Drawer (Artifact List) |  ------------------------------------- |
|                          |  [Toolbar: "AI Gen/Improve SRS Section" Button, "Export SRS" Button] |
|                          |  ------------------------------------- |
|                          |  [Structured Markdown Editor]         |
|                          |  (SRS Document Editor)                |
|                          |  ------------------------------------- |
|                          |  [Requirements Table (Below Editor or Separate Tab within this main tab) ] |
------------------------------------------------------------------
```

**Tab 3: Basic Design**

```
------------------------------------------------------------------
| AppBar: Workspace Title | Basic Design Tab (Active) | ... Tabs |
------------------------------------------------------------------
| Drawer (Artifact List) |  ------------------------------------- |
|                          |  [Tab Navigation within "Basic Design" Tab] |
|                          |  |-- Screen Maps --|-- API List --|-- ER Diagram --|-- Diagrams --|
|                          |  ------------------------------------- |
|                          |  [Content Area - Changes based on selected sub-tab] |
|                          |  ------------------------------------- |
------------------------------------------------------------------

* **"Screen Maps" Sub-tab Content:** [Toolbar: "AI Suggest Screen Flow" Button] + [Interactive Screen Flow Diagram (react-flow)]
* **"API List" Sub-tab Content:** [Toolbar: "AI Generate API List" Button] + [API List Table]
* **"ER Diagram" Sub-tab Content:** [Toolbar: "AI Generate ER Diagram", "AI Suggest entity schema from content" Buttons] + [ER Diagram Tool (Excalidraw or Mermaid Preview)]
* **"Diagrams" Sub-tab Content:** [Toolbar: "AI Generate Diagram (Sequence, Activity, System Overview)" Buttons] + [Diagram Area (Mermaid Preview or Diagramming Tool)]
```

**3. UI/UX Considerations for Each Tab**

*   **General UI/UX for `WorkingSpacePage`:**
    *   **Clean and Consistent:** Maintain a consistent look and feel across all tabs using Material UI components.
    *   **Clear Navigation:** Tabs for primary SDLC steps, sub-tabs within "Basic Design" for different design artifacts.
    *   **Contextual Toolbars:** Toolbars at the top of each tab/sub-tab for relevant actions (AI generation, export, etc.).
    *   **Artifact Sidebar:**  Always visible sidebar to access and manage artifacts within the workspace. Filtering and search in the sidebar are crucial as the number of artifacts grows.
    *   **Visual Feedback:** Use loading indicators during AI operations, clear error messages, and visual cues to indicate active elements and selections.

*   **Project Plan Tab:**
    *   **Split Pane Layout:** Ideal for simultaneous idea capture and wireframing. Allow users to resize panes.
    *   **Markdown Editor UX:** Basic formatting toolbar, clear visual separation of notes. Focus on speed and ease of jotting down ideas.
    *   **Excalidraw UX:**  Keep the Excalidraw interface clean and focused on basic wireframing. Provide templates or stencils for common UI elements if helpful.
    *   **Backlog UX:** Kanban board should be intuitive and drag-and-drop friendly. Cards should be easily editable and linkable. Consider a modal or side panel for detailed card editing.

*   **Requirements Tab:**
    *   **Structured Editor:**  Provide visual cues for SRS sections. Consider using a library that helps structure Markdown (e.g., outlining or section folding).
    *   **Requirements Table UX:**  Table should be sortable, filterable, and searchable. Inline editing of table cells for quick updates.  Ability to add/remove columns if needed.
    *   **Link to Backlog UX:** Easy way to establish links between requirements and backlog items (drag-and-drop from backlog to requirement table, or a link selection UI).

*   **Basic Design Tab:**
    *   **Tabbed Sub-Navigation:**  Use sub-tabs to organize different design artifacts.
    *   **Screen Map UX:** Interactive and zoomable diagram. Easy to add, connect, and label screens. Drag-and-drop components for screen elements (if desired).
    *   **API List Table UX:** Similar to Requirements Table - sortable, filterable, editable. Consider features like API testing or documentation preview within the table.
    *   **ER Diagram UX:**  If using Excalidraw for ER diagrams, provide pre-defined shapes for entities and relationships. If using Mermaid, provide a live preview and syntax highlighting in the editor.
    *   **Diagrams (Sequence, Activity, etc.) UX:** Primarily text-based definition (Mermaid). Live preview is essential. Provide diagram templates or examples.

**4. Implementation Approach**

*   **Component-Based Architecture:**  Continue breaking down the UI into reusable components (e.g., `MarkdownEditor`, `ExcalidrawComponent`, `KanbanBoard`, `DataTable`, `DiagramTool`).
*   **State Management:**  Use React Context for `WorkspaceContext` and potentially consider a library like Redux or Zustand if state management becomes very complex, especially with inter-tab data dependencies.
*   **AI Service Integration:**  Maintain a dedicated `aiService.js` (as previously discussed) for all AI API interactions. Ensure robust error handling and loading state management in components using AI features.
*   **Context Menus Implementation:** Use a library for context menus in React or implement custom context menu logic. Ensure context menus are consistently available in text editors and diagram tools.
*   **Data Persistence:** Plan how artifacts and data will be saved and loaded. Ensure data consistency and versioning for artifacts as per your data model.
*   **JavaScript Libraries:** Leverage JavaScript libraries for:
    *   Markdown Editing (`react-markdown`, `SimpleMDE`, etc.)
    *   Excalidraw (`excalidraw` library)
    *   Panel Split (`react-resizable-panels` library)
    *   Diagramming (`react-flow`, `react-diagrams`, Mermaid.js for text-based diagrams)
    *   Kanban Board (`react-beautiful-dnd`, or a dedicated Kanban component library)
    *   Data Tables (`react-table`, Material UI's `DataGrid` - if suitable)
    *   Context Menus (if using a library)

By following this detailed workflow, screen map, and UI/UX plan, we can build a `WorkingSpacePage` that effectively guides users through the initial SDLC stages, leveraging AI to enhance their productivity and creativity. Remember to iterate on your design based on user feedback as you develop.


## Details Spect For Workflow in Working Page -> PROJECT PLAN

### Common spect for Artifact

When user Select one Tab ( Active one Artifact), at sidebar let's render inspector ( for artifact)
Let's break that component for reuseable and import in SideBar and pass current active artifact as params.
that component should render at Top of "Working Documents" section. and allow user edit some properties as bellow
( basicly it's edit view of Artifact). 
+ title
+ art-type (need define constant of art type to user selectable -> optional free entry if not selectable)
+ dependences -> when click to select just show popup list available artifacts in current workspace
  and user can select multiple. artifacts select diaglog should split to shared components maybe use in multiplace. in this dialog should render artifacts as table ( document id, title, art type, updated at)
  and have search bar in top, user for quick search filter by art type and title or doc id
  after user selected multi artfiact, should update artifact and display dependences in inspector sidebar
  as easy to view: tags style ? ( and can click one x icon to remove)
+ and at bottom of artifact inspector, let's show some actions:
+ show extension of file (.md, .txt, .xlsx, .docx, .pdf, .excalidraw) - where to display please onsider
for example: file name .md or (just bellow title with caption text ?) 
- download: when click will download arficat file. just call api to export file.
( please add endpoint to client.js - and write spect for that endpoint, we will develop later)
- ensure left tab sidebar inspector data should sync in right ( current selected artifact).

### Spect for Editor Tab ( In Detail Editor )
1. Allow user free enter text
2. At top-left, render button for work in FULL Screen ( toogle full or colapse)
3. At bottom, render as very thin (like status bar) list of actions with button type text (no border, no fill) 
with name like: "Copilot Chat",  "Quick Refine".. as action name can work with this note.
and list of actions name should be generated from one APIs, for example API will return:
"context_actions" : [ {"id": 1, "title": "quick refine", "msg":"help me define this docs" }, {...} ]
and when user click to one action, should call API endpoint: /colpilot with: 
{
    context action id: 1,  
    context action msg: "help me define this docs",
    artifact_id: "id of artifact" working on or None,
    note content: "current content of note" - must required if artifact_id is null.
}
for implement detail each action, can implement later. 