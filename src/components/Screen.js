import React, {useEffect} from "react";
import {createComponentByType} from "./Component";
import RootLayout from "./RootLayout";
import {fetchScreenIfNeeded} from "../features/screens/screenActions";
import { useDispatch, useSelector } from 'react-redux'
import {firstNonNull, orElse, resolveIndirectToString} from "../util";
import {loadingScreen} from "./Loading";

import "./Screen.scss"
import EditorSite from "./EditorSite";

function createComponents(content, enrichProps, factory, collector) {
    if (enrichProps === null || typeof enrichProps === "undefined") {
        enrichProps = (props) => props;
    }
    if (factory === null || typeof factory === "undefined") {
        factory = createComponentByType;
    }
    if (collector === null || typeof collector === "undefined") {
        collector = (x, _) => x;
    }

    const components = [];
    if (content !== null && typeof content !== "undefined") {
        if (Array.isArray(content)) {
            let index = 0;
            for (const c of content) {
                const props = enrichProps({...c, key: firstNonNull(c.key, c["@id"], index)});

                const component = collector(factory(props), props);
                if (component !== null && typeof component !== "undefined") {
                    components.push(component);
                }
            }
        } else {
            const props = enrichProps({...content, key: firstNonNull(content.key, content["@id"], 1)});

            const component = collector(factory(props), props);
            if (component !== null && typeof component !== "undefined") {
                components.push(component);
            }
        }
    } else {
        components.push(<div>Empty screen</div>);
    }
    return components;
}

export default function Screen(props) {

    // Do we have layout?
    const {content, layout: layoutId} = props;

    let resolvedLayoutId = resolveIndirectToString(layoutId, "").trim();
    const needsLayout = resolvedLayoutId.length > 0;

    const layout = useSelector(state => needsLayout ? orElse(state.screens.entities[resolvedLayoutId], {}).screen : null);

    const dispatch = useDispatch();
    useEffect(() => {
        if (needsLayout) {
            dispatch(fetchScreenIfNeeded(resolvedLayoutId));
        }
    }, [dispatch]);


    const components = [];


    if (needsLayout /*&& layout !== null && typeof layout !== "undefined"*/) {

        // Collect screen components and render them to a layout
        console.log("LAYOUT", layout);

        if (layout) {
            // Layout already loaded

            // Collect components first (M(zoneId, []component))
            // These will be displayed "lazily" when the template is rendered, hence
            // following returns null from its collector
            const templateData = { zoneComponents: {} };



            createComponents(content,
                (props) => {
                    // Add editor site
                    return {...props, editorSite: new EditorSite(props)};
                },
                null,
                (component, componentProps) => {
                    const {container: dropZone} = componentProps;
                    // TODO wtf is dropzone here?
                    if (templateData.zoneComponents[dropZone] == null ||
                        typeof templateData.zoneComponents[dropZone] === "undefined") {
                        templateData.zoneComponents[dropZone] = [];
                    }
                    templateData.zoneComponents[dropZone].push(
                        {component, props: componentProps});

                    return null;
            });

            // console.log("dropZoneToComponentsMap:", dropZoneToComponentsMap);

            // Create layout components
            components.push(createComponents(layout.content, null, (componentProps) => {
                return createComponentByType({...componentProps, templateData});
            }));

            // TODO warning about unused components (i.e. without matching container / id pair)
        } else {
            // Still loading?
            //components.push(loadingScreen());
        }

    } else {
        // Just render the screen
        components.push(createComponents(content));
    }


    return (
        <div className={"Screen"}>
            <RootLayout>
                {components}
            </RootLayout>
        </div>
    );

}