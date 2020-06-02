import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

export default class DndEditor {
    constructor(dom){
        this.state = {
            items: sections
        }
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
          return;
        }
    
        const items = reorder(
          this.state.items,
          result.source.index,
          result.destination.index
        );
    
        this.setState({
          items
        });
    }
    static wrapDnd() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {dom}
            </DragDropContext>
        )
    }
}