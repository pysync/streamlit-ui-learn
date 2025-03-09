/**
 * Proposed Component Architecture
 * 
 * /components
 *   /artifacts
 *     - ArtifactViewer.js (main container)
 *     - ArtifactEditor.js (edit container)
 *     - ArtifactInspector.js (metadata panel)
 *     - ArtifactList.js
 *     [ dialogs ]
 *       - CreateArtifactDialog.js
 *       - SelectArtifactDialog.js 
 *       - VersionHistoryDialog.js
 *     [ types ]  
 *       - DocumentViewer.js
 *       - DiagramViewer.js
 *       - TableViewer.js
 *       - KanbanViewer.js
 *       - ExcalidrawViewer.js
 *   /shared
 *     - MarkdownEditor.js
 *     - SplitView.js
 *     - TabHeader.js
 *     - RelatedItemsPanel.js
 *     - ViewSelector.js
 
    import flow:
    WorkspacePage
     -> WorkspaceSidebar
     -> ArtifactTypeList
     -> ArtifactViewer -> for main entry point import artifact viewer type...
     -> ArtifactEditor
     -> ArtifactInspector
*/ 


/**
 * 
Looking at the ARTIFACT_VISUALIZATIONS file, I can see several patterns in the visualization types across artifacts:
Document-based artifacts (using VISUALIZATION_TYPES.DOCUMENT)
Table-based artifacts (using VISUALIZATION_TYPES.TABLE)
Diagram-based artifacts (using VISUALIZATION_TYPES.DIAGRAM)
Chart-based artifacts (using VISUALIZATION_TYPES.CHART)
Kanban-based artifacts (using VISUALIZATION_TYPES.KANBAN)
Dashboard-based artifacts (using VISUALIZATION_TYPES.DASHBOARD)
Code-based artifacts (using VISUALIZATION_TYPES.CODE)
Matrix-based artifacts (using VISUALIZATION_TYPES.MATRIX)
Timeline-based artifacts (using VISUALIZATION_TYPES.TIMELINE/GANTT)
 */
