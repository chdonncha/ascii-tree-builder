# ascii-tree-builder-v2

## Structure Manipulation Rules

### General Rules:
1. **Tree Structure Integrity**: All nodes must have a parent, except for the root node, ensuring no orphan nodes exist within the tree.
2. **Node Manipulation:** Nodes can be moved up and down within their current level or across different levels, respecting the hierarchical constraints of the tree.
3. **Node Indentation:** Nodes can be indented (moved deeper into the tree) or outdented (moved towards the root), maintaining the parent-child relationship integrity.
4. **Node Deletion:** Deleting a parent node will also delete its children, unless the children are reassigned to another parent before deletion.
5. **Adding New Nodes:** New nodes can be added as children to the currently selected node.
6. **Renaming Nodes:** Nodes can be renamed at any time.
7. **Node Icons:** Nodes can be assigned an icon to represent either a folder or a file for visual distinction only. This does not affect the tree's structural rules.

## Specific Manipulation Rules:
1. **Moving Nodes:**
Use the designated button or hotkey to move the selected node up or down within its current level or to another level. When moving a node up or down,
it will become a child of the node it is moved into. A node cannot be moved in a way that it becomes its own parent or child.
3. **Indenting and Outdenting Nodes:**
Indenting a node makes it a child of the node immediately above it.
Outdenting a node moves it one level up in the hierarchy, making it a sibling of its former parent, provided it is not the root.
4. **Deleting Nodes:**
When a node is deleted, all its child nodes are also deleted unless they are explicitly moved to another parent prior to deletion.
5. **Adding and Renaming Nodes:**
To add a new node, select the intended parent node and use the add function. The new node will automatically become a child of the selected node.
Renaming is straightforward: select the node and apply the rename function.

## Integrity and Constraints:
1. **No Orphan Nodes:** Every node must either be a root or have a parent.
2. **Maintaining Hierarchical Order:** Nodes must maintain a logical hierarchical order, where child nodes cannot precede parent nodes in the structure.
3. **Consistent Parent-Child Relationship:** Moving, adding, or deleting nodes must not violate the parent-child relationship within the tree.
