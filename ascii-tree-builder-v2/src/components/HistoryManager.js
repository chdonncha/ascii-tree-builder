export default class HistoryManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    pushState(state) {
        this.undoStack.push(state);
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length > 0) {
            const state = this.undoStack.pop();
            this.redoStack.push(state);
            return state;
        }
        return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.undoStack.push(state);
            return state;
        }
        return null;
    }
}
