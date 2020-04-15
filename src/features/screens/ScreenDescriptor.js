import {ScreenComponent} from "./ScreenComponent";

export class ScreenDescriptor {

    /**
     *
     * @param {string} syntax e.g. "vssd 1.0" (optional)
     * @param {string} name screen name
     * @param {ScreenComponent} content screen content
     */
    constructor(syntax, name, content) {
        this.syntax = syntax;
        this.name = name;
        this.content = content;
    }

}