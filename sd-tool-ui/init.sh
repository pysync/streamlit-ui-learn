#!/bin/bash

# Create directories (mkdir -p won't overwrite and creates parents as needed)
mkdir -p src/components/Workspace
mkdir -p src/components/Artifact
mkdir -p src/components/Common
mkdir -p src/contexts
mkdir -p src/pages
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/utils

# Function to create files safely
create_file() {
    local file="$1"
    if [ ! -f "$file" ]; then
        touch "$file"
        echo "Created file: $file"
    else
        echo "File exists, skipping: $file"
    fi
}

# Create component files
create_file "src/components/Workspace/WorkspaceList.js"
create_file "src/components/Workspace/WorkspaceItem.js"
create_file "src/components/Artifact/ArtifactSidebar.js"
create_file "src/components/Artifact/ArtifactTabs.js"
create_file "src/components/Artifact/ArtifactPopup.js"
create_file "src/components/Common/Header.js"

# Create context files
create_file "src/contexts/WorkspaceContext.js"

# Create page files
create_file "src/pages/HomePage.js"
create_file "src/pages/WorkingSpacePage.js"

# Create route files
create_file "src/routes/AppRoutes.js"

# Create service files
create_file "src/services/client.js"

# Create utility files
create_file "src/utils/helpers.js"

# Create root files
create_file "src/App.js"
create_file "src/index.js"

echo "Structure creation complete"