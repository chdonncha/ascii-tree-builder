export default class HistoryManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  pushState(state) {
    this.undoStack.push(JSON.stringify(state));
    this.redoStack = [];
  }

  undo(nodes) {
    if (this.undoStack.length > 0) {
      this.redoStack.push(JSON.stringify(nodes));
      const prevState = JSON.parse(this.undoStack.pop());
      return prevState;
    }
    return null;
  }

  redo(nodes) {
    if (this.redoStack.length > 0) {
      this.undoStack.push(JSON.stringify(nodes));
      const nextState = JSON.parse(this.redoStack.pop());
      return nextState;
    }
    return null;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }
}
