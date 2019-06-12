
/**
 * Represents a door.
 */
export class Door {
  
  public pivot: Entity;
  public left: Entity;
  public right: Entity;
  public transform: Transform;
  
  /**
   * Construct a new pair of doors.
   */
  constructor(transform: Transform) {
    
    // The pivot: a containing group.
    this.pivot = new Entity();
    this.pivot.addComponent(transform);

    // The left half of the door.
    this.left = new Entity();
    this.left.setParent(this.pivot);
    this.left.addComponent(new Transform({
      position: new Vector3(1.2, 0, .2),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(3, 3, 3)
    }));
    this.left.addComponent(new GLTFShape("models/Loc_door_L.gltf"));
    this.left.addComponent(new SlideDoorState(
      new Vector3(1.2, 0, .2),
      new Vector3(0.2, 0, -0.13)
    ));
    this.left.addComponent(new OnClick(e => {this.toggle();}));
    
    // The right half of the door.
    this.right = new Entity();
    this.right.addComponent(new Transform({
      position: new Vector3(1.3, 0, .2),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(3, 3, 3)
    }));
    this.right.setParent(this.pivot);
    this.right.addComponent(new GLTFShape("models/Loc_door_R.gltf"));
    this.right.addComponent(new SlideDoorState(
      new Vector3(1.3, 0, .2),
      new Vector3(2.5, 0, .1)
    ));
    this.right.addComponent(new OnClick(e => {this.toggle()}))
    
  }
  
  /**
   * Toggles the SlideDoorState on both halves of the door.
   */
  public toggle(){
    let leftDoorState = this.left.getComponent(SlideDoorState);
    leftDoorState.closed = !leftDoorState.closed;
    let rightDoorState = this.right.getComponent(SlideDoorState);
    rightDoorState.closed = !rightDoorState.closed;
  }
}

// custom component to handle opening and closing doors
@Component('slideDoorState')
export class SlideDoorState {
  closed: boolean = true
  fraction: number = 1
  closedPos: Vector3
  openPos: Vector3
  constructor(closed: Vector3, open: Vector3){
    this.closedPos = closed
    this.openPos = open
  }
}

// a system to carry out the rotation
export class SliderDoorSystem implements ISystem {
  
  // a group to keep track of all entities with a DoorState component
  private doors = engine.getComponentGroup(SlideDoorState);
 
  update(dt: number) {
    // iterate over the doors in the component group
    for (let door of this.doors.entities) {
      
      // get some handy shortcuts
      let state = door.getComponent(SlideDoorState)
      let transform = door.getComponent(Transform)
      // check if the rotation needs to be adjusted
      if (state.closed == false && state.fraction < 1) {
        state.fraction += dt
        transform.position = Vector3.Lerp(state.closedPos, state.openPos, state.fraction)
      } else if (state.closed == true && state.fraction > 0) {
        state.fraction -= dt
        transform.position = Vector3.Lerp(state.closedPos, state.openPos, state.fraction)
      }
    }
  }
}
