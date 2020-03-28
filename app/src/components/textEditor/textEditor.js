
export default class TextEditor{
    constructor(element, virtualElement){
        this.element = element;
        this.virtualElement = virtualElement;
        this.element.addEventListener('click', () => this.onClick());
        this.element.addEventListener('blur', () => this.onBlur());
        this.element.addEventListener('keypress', (e) => this.onKeyPress(e));
        this.element.addEventListener('input', () => this.onTextEdit());
        if(this.element.parentNode.nodeName === "A" || this.element.parentNode.nodeName === "BUTTON"){
            this.element.addEventListener('contextmenu', (e) => this.onContextMenu(e));
        }
    }

    onClick(){
        this.element.contentEditable = true;
        this.element.focus();
    }

    onBlur(){
        this.element.removeAttribute('contenteditable');
    }

    onKeyPress(e){
        if(e.keyCode === 13){ //enter button
            this.element.blur();
        }
    }

    onTextEdit(){
        //write changes from dirty copy to pure
        this.virtualElement.innerHTML = this.element.innerHTML;
    };

    onContextMenu(e){
        e.preventDefault();
        this.onClick();
    }
}
