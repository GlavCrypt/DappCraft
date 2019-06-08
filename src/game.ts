import { SlideDoorState, SliderDoorSystem } from "./modules/slide-door"
import * as EthereumController from "@decentraland/EthereumController"
import * as PipeMenu from "./modules/pipe-menu"

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

//
// SCENE
//
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
engine.addEntity(doorPivot)

const doorLeft = new Entity()
doorLeft.setParent(doorPivot)
doorLeft.addComponent(new Transform(
{
  position: new Vector3(-2.5, 2, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(2, 4, 0.2)
}))
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
engine.addEntity(doorLeft)

const doorRight = new Entity()
doorRight.addComponent(new Transform(
{
  position: new Vector3(2.5, 2, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(2, 4, 0.2)
}))

doorRight.setParent(doorPivot)
doorRight.addComponent(new BoxShape())
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
engine.addEntity(doorRight)

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
const btnTexture = new Texture("textures/w1.png")

// Create material
let btnMaterial = new Material()

btnMaterial.transparencyMode = 3
btnMaterial.albedoTexture = btnTexture
btnMaterial.alpha = 0.5

// Add material to wheels
btn.addComponent(btnMaterial)

btn.addComponent(new BoxShape())
//btn.addComponent(RedMaterial)
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

//
// PIPES
//

for (let i = 0; i < 5; i++) {

  var entity = new Entity("Pipe " + i)
  const pipe = new PipeMenu.Pipe();

  pipe.items = [
    new PipeMenu.Item('models/glasses.gltf', .01, 1),
    new PipeMenu.Item('models/glasses.gltf', .02, 3),
    new PipeMenu.Item('models/glasses.gltf', .03, 3),
    new PipeMenu.Item('models/glasses.gltf', .02, 3),
    new PipeMenu.Item('models/glasses.gltf', .01, 5)
  ]

  entity.addComponent(pipe)
  entity.addComponent(new Transform({
    position: new Vector3(i * 3, 1, 8)
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