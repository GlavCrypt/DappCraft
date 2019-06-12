import {Observatory} from 'modules/observatory';
import {SliderDoorSystem} from 'modules/door';

// OBSERVATORY
let obs = new Observatory(new Transform({position: new Vector3(16, 0, 16)}));
engine.addEntity(obs.group);

// Make sure the doors get animated.
engine.addSystem(new SliderDoorSystem());

/*
import * as EthereumController from "@decentraland/EthereumController"

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
*/

//
// TEST BUTTON
//
/*
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
*/

log("LOADING OK")
