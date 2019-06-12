
/**
 * Represents a pipe menu, with next and previous buttons, a buy button, and an item on display which can be selected.
 */
export class PipeMenu {
  
  public id: string;
  public group: Entity;
  public items: MenuItem[];
  public currentIndex: number;
  public currentItemEntity: Entity;
  
  /**
   * Construct a pipe menu which sells the given array of MenuItems, is located at the given Transform, and has the given identifying string.
   */
  constructor(items: MenuItem[], transform: Transform, id: string) {
    
    this.id = id;
    
    // MenuItems offered by the menu.
    this.items = items;
    
    // Group to contain pipe menu.
    this.group = new Entity("Pipe " + id);
    this.group.addComponent(transform);
    
    // Next button.
    const nextButton = new Entity("Pipe " + id + " next")
    nextButton.setParent(this.group);
    nextButton.addComponent(new BoxShape());
    nextButton.addComponent(new Transform({
      position: new Vector3(-0.5, 1, 0),
      scale: new Vector3(.3, .3, .3)
    }));
    nextButton.addComponent(new OnClick(() => {
      this.clickNext();
    }));
    
    // Prev button.
    const prevButton = new Entity("Pipe " + id + " prev")
    prevButton.setParent(this.group);
    prevButton.addComponent(new BoxShape())
    prevButton.addComponent(new Transform({
      position: new Vector3(0.5, 1, 0),
      scale: new Vector3(.3, .3, .3)
    }));
    prevButton.addComponent(new OnClick(() => {
      this.clickPrev();
    }));
    
    // Buy button.
    const buyButton = new Entity("Pipe " + id + " buy")
    buyButton.setParent(this.group)
    buyButton.addComponent(new BoxShape())
    buyButton.addComponent(new Transform({
      position: new Vector3(0, 1, 0),
      scale: new Vector3(.3, .3, .3)
    }));
    buyButton.addComponent(new OnClick(() => {
      this.clickBuy();
    }));
    
    // Item being bought.
    this.currentItemEntity = new Entity();
    this.currentItemEntity.addComponent(new Transform());
    this.currentItemEntity.setParent(this.group);
    this.setIndex(0);
    
  }
  
  /**
   * Set the current item index to the given number, and update the selected item accordingly.
   */
  public setIndex(index: number) {
    
    // Protect from invalid selection.
    if (index < 0 || index >= this.items.length) {
      return;
    }
    
    this.currentIndex = index;
    let item = this.items[this.currentIndex];
    
    // Update position and scale.
    let transf = this.currentItemEntity.getComponent(Transform);
    transf.position.set(item.position.x, item.position.y, item.position.z);
    transf.scale.set(item.size, item.size, item.size);
    
    // Update shape.
    this.currentItemEntity.addComponentOrReplace(item.model);
    
    log('New index for menu ' + this.id + ': ' + this.currentIndex);
  }
  
  /**
   * Click the next button, increasing the index (or looping back).
   */
  public clickNext() {
    this.setIndex((this.currentIndex + 1) % this.items.length);
  }
  
  /**
   * Click the prev button, decreasing the index (or looping forward).
   */
  public clickPrev() {
    this.setIndex(this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1);
  }
  
  /**
   * Click the buy button.
   */
  public clickBuy() {
    // TODO
    log('BUY ' + this.items[this.currentIndex].title);
  }
}

/**
 * Represents a single option in the menu.
 */
export class MenuItem {
  model: GLTFShape;
  title: string;
  price: number;
  size: number;
  position: Vector3

  constructor(title: string, model: GLTFShape, size: number, price: number, position: Vector3) {
    this.title = title;
    this.model = model;
    this.price = price;
    this.size = size;
    this.position = position;
  }
}
