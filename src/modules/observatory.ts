import {Door, SlideDoorState} from 'door';
import {PipeMenu, MenuItem} from 'pipemenu';
import {BuyScreen} from 'buyscreen';

/**
 * A class to manage the entire observatory set of entities.
 */
export class Observatory {
  
  public group: Entity;
  
  /**
   * Construct a new observatory at the given transform.
   */
  constructor(transform: Transform, requirePayment) {
    
    // Group to contain entities.
    this.group = new Entity();
    this.group.addComponent(transform);
    
    this.createDomeAndInterior();
    this.createDoors();
    this.createPipeMenus();
    this.createScreenMenu(requirePayment);
  }
  
  /**
   * Create the actual observatory dome, plus interior scenery.
   */
  public createDomeAndInterior() {
    // The dome itself.
    let dome = new Entity();
    dome.addComponent(new GLTFShape("models/scene.gltf"))
    dome.addComponent(new Transform({
      scale: new Vector3(0.075, 0.075, 0.075)
    }));
    dome.setParent(this.group);

    // The interior of the dome.
    let interior = new Entity()
    interior.addComponent(new GLTFShape("models/objects.gltf"))
    interior.addComponent(new Transform({
      scale: new Vector3(3, 3, 3)
    }));
    interior.setParent(this.group);
  }
  
  /**
   * Create the doors.
   */
  public createDoors() {
    
    let door = new Door(new Transform({
      position: new Vector3(-1.3, 0, -0.2),
    }));
    door.pivot.setParent(this.group);
  }
  
  /**
   * Create the pipe menus.
   */
  public createPipeMenus() {
    const pipesPositions: Vector3[] = [
      new Vector3(5.8, 1.5, 3.3),
      new Vector3(6.7, 1.5, 1.0),
      new Vector3(7.1, 1.5, -1.3),
      new Vector3(6.7, 1.5, -4),
      new Vector3(5.8, 1.5, -6.5),
    ]

    const pipesRotations: Vector3[] = [
      new Vector3(0, -115, 0),
      new Vector3(0, -100, 0),
      new Vector3(0, -90, 0),
      new Vector3(0, -80, 0),
      new Vector3(0, -70, 0),
    ]

    const menuItems = [
      new MenuItem("Helmet",       new GLTFShape('models/helmet.gltf'),  0.03,  1, new Vector3(0, -1, 0)),
      new MenuItem("Glasses",      new GLTFShape('models/glasses.gltf'), 0.008, 3, new Vector3(0,  0, 0)),
      new MenuItem("Also Helmet",  new GLTFShape('models/helmet.gltf'),  0.03,  3, new Vector3(0, -1, 0)),
      new MenuItem("Also Glasses", new GLTFShape('models/glasses.gltf'), 0.008, 3, new Vector3(0,  0, 0)),
      new MenuItem("Third Helmet", new GLTFShape('models/helmet.gltf'),  0.03,  5, new Vector3(0, -1, 0))
    ];
    
    // Generate each pipe menu, and add its root entity to the observatory's group.
    for (let i = 0; i < 5; i++) {
      let menu = new PipeMenu(
        menuItems,
        new Transform({
          position: pipesPositions[i],
          rotation: Quaternion.Euler(pipesRotations[i].x, pipesRotations[i].y, pipesRotations[i].z)
        }),
        "" + i
      );
      menu.group.setParent(this.group);
    }
  }
  
  /**
   * Add the screen menu.
   */
  public createScreenMenu(requirePayment) {
    let screenMenu = new BuyScreen(
      new Transform({
        position: new Vector3(-3.1, 5.5, -3),
        rotation: new Quaternion(-0.3075095991233633, -0.5218383131268737, -0.7688128993119207, 0.20505937494171264),
        scale: new Vector3(1, 1, 1)
      }),
      this.group,
      requirePayment // for some reason, importing this inside BuyScreen.ts broke everything.
    );
  }
}
