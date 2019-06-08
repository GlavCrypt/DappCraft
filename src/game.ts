import { SlideDoorState, SliderDoorSystem } from "./modules/slide-door";
import * as EthereumController from "@decentraland/EthereumController"

const eth = EthereumController

executeTask(async () => {
  try {
    const address = await eth.getUserAccount()
    log(address)
    myText.value = address
  } catch (error) {
    log(error.toString())
  }
})

const myEntity = new Entity()
const myText = new TextShape("Loading")
myEntity.addComponent(myText)
myEntity.addComponent(new Transform({
  position: new Vector3(-1, 5, -1),
}))
engine.addEntity(myEntity)

/*
const camera = Camera.instance

export class CameraTrackSystem implements ISystem {
  update() {
    log(camera.position)
    log(camera.rotation.eulerAngles)
  }
}

engine.addSystem(new CameraTrackSystem())
*/

let scene = new Entity()
scene.addComponent(new GLTFShape("models/Location.gltf"))
scene.addComponent(new Transform({
  position: new Vector3(-17, 0, -17),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(3, 3, 3)
}))
engine.addEntity(scene)


let objects = new Entity()
objects.addComponent(new GLTFShape("models/objects.gltf"))
objects.addComponent(new Transform({
  position: new Vector3(-17, 0, -17),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(3, 3, 3)
}))
engine.addEntity(objects)



let glasses = new Entity()
glasses.addComponent(new GLTFShape("models/glasses.gltf"))
glasses.addComponent(new Transform({
  position: new Vector3(7, 0.1, 7),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(0.01, 0.01, 0.01)
}))
engine.addEntity(glasses)

//
// DOOR
//

const doorPivot = new Entity()
doorPivot.addComponent(new Transform())

const doorLeft = new Entity()
doorLeft.addComponent(new Transform(
{
  position: new Vector3(-2.5, 2, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(2, 4, 0.2)
}))

doorLeft.setParent(doorPivot)
doorLeft.addComponent(new BoxShape())
doorLeft.addComponent(new SlideDoorState(
  new Vector3(-1, 2, 0),
  new Vector3(-2.5, 2, 0)
))
doorLeft.addComponent(
  new OnClick(e => {
    let parent = doorLeft.getParent()
    openDoor(parent)
  })
)

const doorRight = new Entity()
doorRight.addComponent(new Transform(
{
  position: new Vector3(2.5, 2, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(2, 4, 0.2)
}))

const emitMaterial = new Material();
emitMaterial.emissiveColor = Color3.Blue()
emitMaterial.emissiveIntensity = 5;

doorRight.setParent(doorPivot)
doorRight.addComponent(new BoxShape())
doorRight.addComponent(emitMaterial)
doorRight.addComponent(new SlideDoorState(
  new Vector3(1, 2, 0),
new Vector3(2.5, 2, 0)
))
doorRight.addComponent(
  new OnClick(e => {
    let parent = doorLeft.getParent()
    openDoor(parent)
  })
)

engine.addEntity(doorPivot)
engine.addEntity(doorLeft)
engine.addEntity(doorRight)

engine.addSystem(new SliderDoorSystem())

function openDoor(parent: IEntity){
  for(let id in parent.children){
    const child = parent.children[id]
    let state = child.getComponent(SlideDoorState)
    state.closed = !state.closed
  }   
}



const RedMaterial = new Material()
RedMaterial.albedoColor = Color3.Red()

const btn = new Entity()
btn.addComponent(new BoxShape())
btn.addComponent(RedMaterial)
btn.addComponent(new Transform(
  {
    position: new Vector3(-1, 2, -1),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(0.5, 0.3, 0.1)
  }))
btn.addComponent(
  new OnClick(e => {
    RedMaterial.albedoColor = Color3.White()
    executeTask(async () => {
      try {
        await eth.requirePayment('0x2b70046B540fc32d5AF3fd6B6B8c1096f7328700', 0.001, "ETH")
        log("Succsessfull")
        RedMaterial.albedoColor = Color3.Red()
      } catch (error) {
        log("Failed")
      }
    })
  })
)
engine.addEntity(btn)