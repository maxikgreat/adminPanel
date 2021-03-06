
export default class TextEditor{
    constructor(
        element, 
        virtualElement, 
        showSubmenu,
        hideSubmenu,
        stopScrolling,
        enableScrolling
    ){
        this.element = element;
        this.virtualElement = virtualElement;
        this.showSubmenu = showSubmenu;
        this.hideSubmenu = hideSubmenu;
        this.stopScrolling = stopScrolling;
        this.enableScrolling = enableScrolling;
        this.element.addEventListener('click', (e) => this.onClick(e));
        this.element.addEventListener('blur', () => this.onBlur());
        this.element.addEventListener('keypress', (e) => this.onKeyPress(e));
        this.element.addEventListener('input', () => this.onTextEdit());
        if(this.element.parentNode.nodeName === "A" || this.element.parentNode.nodeName === "BUTTON"){
            this.element.addEventListener('contextmenu', (e) => this.onContextMenu(e));
        }
    }

    onClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.stopScrolling();
        this.element.contentEditable = true;
        this.element.focus();
        this.showSubmenu(
            this.element.getBoundingClientRect().left - 10,
            this.element.getBoundingClientRect().top - 30
        );
    }

    onBlur(){
        this.enableScrolling();
        this.element.removeAttribute('contenteditable');
        this.onTextEdit();
    }

    onKeyPress(e){
        if(e.keyCode === 13){ //enter button
            this.element.blur();
        }
    }

    onTextEdit(){
        //write changes from dirty copy to pure
        this.virtualElement.innerHTML = this.element.innerHTML;
        console.log(this.element.innerHTML);
    };

    onContextMenu(e){
        e.preventDefault();
        this.onClick();
    }
}
