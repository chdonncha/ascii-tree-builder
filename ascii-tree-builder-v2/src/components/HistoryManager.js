export default class HistoryManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    pushState(state) {
        this.undoStack.push(JSON.stringify(state));
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length > 0) {
            const state = JSON.parse(this.undoStack.pop());
            this.redoStack.push(JSON.stringify(state));
            return state;
        }
        return null;
    }

    redo() {
        if (this.redoStack.length > 0) {
            const state = JSON.parse(this.redoStack.pop());
            this.undoStack.push(JSON.stringify(state));
            return state;
        }
        return null;
    }
}
