/**
 * Proposed Component Architecture
 * 
 * /components
 *   /core
 *     - ArtifactProvider.js (context provider)
 *     - ArtifactContext.js
 *     - WorkspaceContext.js
 *   /artifacts
 *     - ArtifactViewer.js (main container)
 *     - ArtifactEditor.js (edit container)
 *     - ArtifactInspector.js (metadata panel)
 *     - ArtifactList.js
 *     /dialogs
 *       - CreateArtifactDialog.js
 *       - SelectArtifactDialog.js 
 *       - VersionHistoryDialog.js
 *     /types  
 *       - DocumentViewer.js
 *       - DiagramViewer.js
 *       - TableViewer.js
 *       - KanbanViewer.js
 *       - ExcalidrawViewer.js
 *       - ProjectPlanViewer.js
 *   /shared
 *     - MarkdownEditor.js
 *     - SplitView.js
 *     - TabHeader.js
 *     - RelatedItemsPanel.js
 *     - ViewSelector.js
 *   /renderers (function-based rendering helpers)
 *     - documentRenderer.js
 *     - tableRenderer.js
 *     - diagramRenderer.js
 *     - chartRenderer.js
 *     - kanbanRenderer.js
 */ 