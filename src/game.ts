import { SlideDoorState, SliderDoorSystem } from "./modules/slide-door"
import * as EthereumController from "@decentraland/EthereumController"
import * as PipeMenu from "./modules/pipe-menu"

const eth = EthereumController


//
// ETHEREUM ADDRESS
//
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
  scale: new Vector3(0.05, 0.05, 0.05)
}))
engine.addEntity(myEntity)

//
// OBSERVATORY
//

let observatory = new Entity()
observatory.addComponent(new GLTFShape("models/scene.gltf"))
observatory.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(0.075, 0.075, 0.075)
}))
engine.addEntity(observatory)

//
// INTERIOR
//
let interior = new Entity()
interior.addComponent(new GLTFShape("models/objects.gltf"))
interior.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(3, 3, 3)
}))
engine.addEntity(interior)

//
// GLASSES
//

let glasses = new Entity()
glasses.addComponent(new GLTFShape("models/glasses.gltf"))
glasses.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(0.01, 0.01, 0.01)
}))
engine.addEntity(glasses)

//
// DOOR
//
const doorPivot = new Entity()
//doorPivot.addComponent(new Transform())
doorPivot.addComponent(new Transform(
  {
    position: new Vector3(6.7, 0, 7.8),
    rotation: Quaternion.Euler(0, 0, 0)
  }))
engine.addEntity(doorPivot)


const doorLeft = new Entity()
doorLeft.setParent(doorPivot)
doorLeft.addComponent(new Transform(
{
  position: new Vector3(1.2, 0, .2),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(3, 3, 3)
}))
doorLeft.addComponent(new GLTFShape("models/Loc_door_L.gltf"))
doorLeft.addComponent(new SlideDoorState(
  new Vector3(1.2, 0, .2),
  new Vector3(0.2, 0, -0.13)
))
doorLeft.addComponent(
  new OnClick(e => {
    let parent = doorLeft.getParent()
    openDoor(parent)
  })
)
engine.addEntity(doorLeft)

const doorRight = new Entity()
doorRight.addComponent(new Transform(
{
  position: new Vector3(1.3, 0, .2),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(3, 3, 3)
}))
doorRight.setParent(doorPivot)
doorRight.addComponent(new GLTFShape("models/Loc_door_R.gltf"))
doorRight.addComponent(new SlideDoorState(
  new Vector3(1.3, 0, .2),
  new Vector3(2.5, 0, .1)
))
doorRight.addComponent(
  new OnClick(e => {
    let parent = doorLeft.getParent()
    openDoor(parent)
  })
)
engine.addEntity(doorRight)

function openDoor(parent: IEntity){
  for(let id in parent.children){
    const child = parent.children[id]
    let state = child.getComponent(SlideDoorState)
    state.closed = !state.closed
  }   
}

//
// TEST BUTTON
//
const btn = new Entity()
const redMaterial = new Material()
redMaterial.albedoColor = Color3.Red()
btn.addComponent(new BoxShape())
//btn.addComponent(observatoryMaterial)
btn.addComponent(new Transform(
  {
    position: new Vector3(-1, 2, -1),
    rotation: Quaternion.Euler(0, 0, 0),
    scale: new Vector3(0.5, 0.3, 0.1)
  }))
btn.addComponent(
  new OnClick(e => {
    redMaterial.albedoColor = Color3.White()
    executeTask(async () => {
      try {
        await eth.requirePayment('0x2b70046B540fc32d5AF3fd6B6B8c1096f7328700', 0.001, "ETH")
        log("Succsessfull")
        redMaterial.albedoColor = Color3.Red()
      } catch (error) {
        log("Failed")
      }
    })
  })
)
engine.addEntity(btn)

//
// PIPES
//
const pipesPositions:Vector3[] = [
  new Vector3(13.8,1.5,11.3),
  new Vector3(14.7,1.5,9.0),
  new Vector3(15.1,1.5,6.7),
  new Vector3(),
  new Vector3(),
]

const pipesRotations:Vector3[] = [
  new Vector3(0,-115,0),
  new Vector3(0,-100,0),
  new Vector3(0,-100,0),
  new Vector3(),
  new Vector3(),
]

for (let i = 0; i < 5; i++) {
  var entity = new Entity("Pipe " + i)
  const pipe = new PipeMenu.Pipe();
  pipe.items = [
    new PipeMenu.Item('models/helmet.gltf', .03, 1, new Vector3(0, -1, 0)),
    new PipeMenu.Item('models/glasses.gltf', .008, 3, new Vector3(0, 0, 0)),
    new PipeMenu.Item('models/helmet.gltf', .03, 3, new Vector3(0, -1, 0)),
    new PipeMenu.Item('models/glasses.gltf', .008, 3, new Vector3(0, 0, 0)),
    new PipeMenu.Item('models/helmet.gltf', .03, 5, new Vector3(0, -1, 0))
  ]
  
  entity.addComponent(pipe)
  entity.addComponent(new Transform({
    position: pipesPositions[i],
    rotation: Quaternion.Euler(pipesRotations[i].x, pipesRotations[i].y, pipesRotations[i].z)
  }))

  const nextButton = new Entity("Pipe " + i + " next")
  nextButton.setParent(entity)
  nextButton.addComponent(new PipeMenu.Button(pipe, entity, "next"))
  nextButton.addComponent(new BoxShape())
  nextButton.addComponent(new Transform({
    position: new Vector3(-0.5, 1, 0),
    scale: new Vector3(.3, .3, .3)
  }))

  const prevButton = new Entity("Pipe " + i + " prev")
  prevButton.setParent(entity)
  prevButton.addComponent(new PipeMenu.Button(pipe, entity, "prev"))
  prevButton.addComponent(new BoxShape())
  prevButton.addComponent(new Transform({
    position: new Vector3(0.5, 1, 0),
    scale: new Vector3(.3, .3, .3)
  }))

  const buyButton = new Entity("Pipe " + i + " buy")
  buyButton.setParent(entity)
  buyButton.addComponent(new PipeMenu.Button(pipe, entity, "buy"))
  buyButton.addComponent(new BoxShape())
  buyButton.addComponent(new Transform({
    position: new Vector3(0, 2, 0),
    scale: new Vector3(.3, .3, .3)
  }))

  engine.addEntity(entity)
  engine.addEntity(nextButton)
  engine.addEntity(prevButton)
  engine.addEntity(buyButton)
}

var pipeSystem = new PipeMenu.PipeMenuSystem();
engine.addSystem(pipeSystem)
engine.addSystem(new SliderDoorSystem())

pipeSystem.init();

log("LOADING OK")