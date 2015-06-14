import Component from "app/templates/component";


class BlockDivider extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "BlockDivider";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    return (
      <div className={"block-container"}>
        <hr className={"block-divider"}/>
      </div>
    );
  }
}


module.exports = BlockDivider;
