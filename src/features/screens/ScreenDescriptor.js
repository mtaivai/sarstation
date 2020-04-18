import {ScreenComponent} from "./ScreenComponent";

export class ScreenDescriptor {

    /**
     *
     * @param {string} syntax e.g. "vssd 1.0" (optional)
     * @param {string} name screen name
     * @param {ScreenComponent} components screen content
     */
    constructor(syntax, name, components) {
        this.syntax = syntax;
        this.name = name;
        this.components = components;
    }

}