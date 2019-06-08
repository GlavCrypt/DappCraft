// custom component to handle opening and closing doors
@Component('slideDoorState')
export class SlideDoorState {
  closed: boolean = false
  fraction: number = 1
  closedPos: Vector3
  openPos: Vector3
  constructor(closed: Vector3, open: Vector3){
    this.closedPos = closed
    this.openPos = open
  }
}


// a group to keep track of all entities with a DoorState component
const doors = engine.getComponentGroup(SlideDoorState)

// a system to carry out the rotation
export class SliderDoorSystem implements ISystem {
 
  update(dt: number) {
    // iterate over the doors in the component group
    for (let door of doors.entities) {
      
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
