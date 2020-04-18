Specifications overview

Note: this document may contain [PlantUML](https://plantuml.com) diagrams. IntelliJ / Webstorm users may
want to install PlantUML Integration plugin as well as Graphviz to display them
correctly.
* See [https://plantuml.com]
* To download Graphviz: [https://www.graphviz.org/download/] 
(Please note that [some Graphviz versions may not work](https://plantuml.com/graphviz-dot))

We have [screens](#screen)

## <a name="screen"></a> Screen


@startuml
abstract class Component {
    id: String
}

Component "0..1 parent" --> Component
note on link
    Component knows its parent, but not necessarily about
    its children (unless it's a Container)
end note

abstract class Container
Container --|> Component
Container "1 parent" o-- "{ordered} ~* component" Component
note on link
    Container (parent) may contain 0..n
    components (children) and the relationship
    is navigable in both directions. Note that
    the association is created using intermediate
    ContainedComponent association class
end note
(Container, Component) .. ContainedComponent

abstract class ContainedComponent {
    component: Component
    constrants: Object
}

class Screen {
    name: String
    id: String
}

Screen o--> "0..1 content" Component

abstract class Layout {
}
Layout --|> Container

abstract class LayoutConstraints {
    screenSize
}

class EdgeLayout {
}
EdgeLayout --|> Layout

class EdgeLayoutConstraints {
    side: Edge
}
EdgeLayoutConstraints --|> LayoutConstraints
enum Edge {
    TOP, RIGHT, BOTTOM, LEFT, CENTER
}
together {
    class EdgeLayout
    class EdgeLayoutConstraints
    enum Edge
}

class AbsoluteLayout {
}
AbsoluteLayout --|> Layout
class AbsoluteLayoutConstraints {
    x
    y
    z
}
AbsoluteLayoutConstraints --|> LayoutConstraints
together {
    class AbsoluteLayout
    class AbsoluteLayoutConstraints
}

class FlowLayout {
}
FlowLayout --|> Layout
class FlowLayoutConstraints {
    width: Integer?
    span: Integer?
}
FlowLayoutConstraints --|> LayoutConstraints
together {
    class FlowLayout
    enum FlowDirection
    class FlowLayoutConstraints
}


@enduml

An example screen with yaml syntax:
```
name: My Screen
content: 
  type: EdgeLayout
  components:
  - component: 
      type: HtmlContent
      content: "Hello there!"
    constraints:
      edge: TOP
  - component:
      type: FlowLayout
      components:
      - component:
          type: HtmlContent
          content: "Content goes here"
        constraints:
        - md: 
           width: 12
        - lg:
           width: 8
    constraints:
      edge: CENTER
  
```

