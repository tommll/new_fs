import * as React from "react";
import ReactDOM from "react-dom";

type Props = {
  show: boolean;
};

const modalRoot = document.getElementById("modal-root");

/**
 * A crude Modal.
 */
export class Modal extends React.Component<Props> {
  el: HTMLDivElement;
  constructor(props: Props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot?.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot?.removeChild(this.el);
  }

  render() {
    if (this.props.show) {
      return ReactDOM.createPortal(this.props.children, this.el);
    }
    return null;
  }
}
