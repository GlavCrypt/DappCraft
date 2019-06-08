export class Item {
    model: string
    title: string
    price: number
    size: number

    constructor(model: string, size: number, price: number) {
        this.model = model
        this.price = price
        this.size = size
    }
}

@Component("pipe")
export class Pipe {
    items: Item[]
    currentIndex: number

    currentEntity: Entity
}

@Component("pipe-button")
export class Button {
    target: Pipe
    targetEntity: Entity
    action: string

    constructor(target: Pipe, targetEntity: Entity, action: string) {
        this.target = target
        this.targetEntity = targetEntity
        this.action = action
    }
}

const pipes = engine.getComponentGroup(Pipe)
const buttons = engine.getComponentGroup(Button)

export class PipeMenuSystem implements ISystem
{
    defaultShape: Shape = new SphereShape();

    init() {
        for (let buttonEntity of buttons.entities)
        {
            buttonEntity.addComponent(new OnClick(e => {
                
                var button = buttonEntity.getComponent(Button) 
                switch (button.action) {
                    case 'next':
                        this.setCurrent(button.target, button.targetEntity, button.target.currentIndex + 1)
                        break;
                    case 'prev':
                        this.setCurrent(button.target, button.targetEntity, button.target.currentIndex - 1)
                        break;
                    case 'buy':
                        log('BUY ' + button.target.items[button.target.currentIndex])
                        break;
                }
                
            }))
        }

        for (let pipeEntity of pipes.entities)
        {
            const pipe = pipeEntity.getComponent(Pipe);
            if (pipe.items.length == 0)
                continue;

            pipe.currentIndex = 0;
            pipe.currentEntity = this.createEntity(pipe.items[0])
            pipe.currentEntity.setParent(pipeEntity)
        }
    }

    update(dt:number){}

    setCurrent(pipe: Pipe, parent: Entity, index: number) {
        if (index < 0)
           index  = pipe.items.length - 1
        if (index >= pipe.items.length)
            index = 0

        if (pipe.currentIndex != index) {
            // if (pipe.currentEntity != null)
            // {
            //     pipe.currentEntity.removeComponent(Transform)
            //     pipe.currentEntity.removeComponent(Shape)
            //     engine.removeEntity(pipe.currentEntity);
            // }

            // pipe.currentEntity = this.createEntity(pipe.items[index])
            // pipe.currentIndex = index
            // pipe.currentEntity.setParent(parent)

            this.updateEntity(pipe.currentEntity, pipe.items[index]);
            pipe.currentIndex = index
        }
    }

    createEntity(item: Item) {
        const result = new Entity()

        if (item.model === null)
            result.addComponent(this.defaultShape)
        else
            result.addComponent(new GLTFShape(item.model))

        result.addComponent(new Transform({
            scale: new Vector3(item.size, item.size, item.size)
        }))

        engine.addEntity(result)
        return result;
    }

    updateEntity(entity: Entity, item: Item) {

        if (item.model === null)
            entity.addComponentOrReplace(new SphereShape())
        else
            entity.addComponentOrReplace(new GLTFShape(item.model))

        entity.addComponentOrReplace(new Transform({
            scale: new Vector3(item.size, item.size, item.size)
        }))
    }
}