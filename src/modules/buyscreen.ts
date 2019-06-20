
/**
 * Generates and manages logic for the Buy Screen.
 */
export class BuyScreen {
  
  textures: {[index: string]: Texture};
  
  public group: Entity;
  
  screen: Entity;
  aboutButton: Entity;
  recipesButton: Entity;
  backButton: Entity;
  buyLeftButton: Entity;
  buyRightButton: Entity;
  buyButton: Entity;
  buyImage: Entity;
  
  buyImgs: string[];
  buyImgIndex: number;
  
  requirePayment: Function;
  
  constructor(transform: Transform, parentGroup: IEntity, requirePayment: Function) {
    
    this.requirePayment = requirePayment;
    
    this.textures = {
      ab_b: new Texture("textures/menus/about_button.png"),
      ab: new Texture("textures/menus/about.png"),
      boot: new Texture("textures/menus/boot.png"),
      buy: new Texture("textures/menus/buy_bg.png"),
      buy_b: new Texture("textures/menus/buy_button.png"),
      l_b: new Texture("textures/menus/left_button.png"),
      main: new Texture("textures/menus/main_bg.png"),
      mask: new Texture("textures/menus/mask.png"),
      rec_b: new Texture("textures/menus/recipes_button.png"),
      r_b: new Texture("textures/menus/right_button.png"),
    };
    
    this.buyImgs = ['boot', 'mask']; // only 2 known options.
    this.buyImgIndex = 0;
    
    this.group = new Entity();
    this.group.setParent(parentGroup);
    this.group.addComponent(transform);
    
    this.screen = new Entity();
    this.screen.addComponent(new BoxShape());
    this.screen.addComponent(new Transform({scale: new Vector3(4, 3, 0.1), rotation: Quaternion.Euler(-90, 0, 0)}));
    let mat = new Material();
    mat.albedoTexture = this.textures.main;
    this.screen.addComponent(mat);
    this.screen.setParent(this.group);
    
    this.doMain();

  }
  
  private removeAll(ents: string[]) {
    for (let entName of ents) {
      
      if (this[entName] !== undefined) {
        engine.removeEntity(this[entName]);
        this[entName] = undefined;
      }
    }
  }
  
  private makeButton(name: string, pos: Vector3, scale: Vector3, texName: string, onClickName: string) {
    if (!this[name]) {
      this[name] = new Entity();
      this[name].addComponent(new PlaneShape());
      this[name].addComponent(new Transform({
        position: pos,
        scale: scale,
        rotation: Quaternion.Euler(-90, 180, 0)
      }));
      let mat = new Material();
      mat.albedoTexture = this.textures[texName];
      this[name].addComponent(mat);
      this[name].setParent(this.group);
      this[name].addComponent(new OnClick(() => {
        this[onClickName]();
      }));
    }
  }
  
  private doMain() {
    this.removeAll(['backButton', 'buyButton', 'buyLeftButton', 'buyRightButton', 'buyImage']);
    
    let screenMat = new Material();
    screenMat.albedoTexture = this.textures.main;
    this.screen.addComponentOrReplace(screenMat);
    
    this.makeButton('aboutButton', new Vector3(-1, 0.1, 0.3), new Vector3(1, 0.5, 1), 'ab_b', 'doAbout');
    this.makeButton('recipesButton', new Vector3(-1, 0.1, -0.3), new Vector3(1, 0.5, 1), 'rec_b', 'doBuy');
  }
  
  private addBack() {
    this.makeButton('backButton', new Vector3(-1.6, 0.1, 1.1), new Vector3(0.3, 0.3, 1), 'l_b', 'doMain');
  }
  
  private doAbout() {
    this.removeAll(['recipesButton', 'aboutButton', 'buyButton', 'buyLeftButton', 'buyRightButton', 'buyImage']);
    
    this.addBack();
    let screenMat = new Material();
    screenMat.albedoTexture = this.textures.ab;
    this.screen.addComponentOrReplace(screenMat);
  }
  
  private doBuy() {
    this.removeAll(['recipesButton', 'aboutButton', 'backButton']);
    
    this.addBack();
    let screenMat = new Material();
    screenMat.albedoTexture = this.textures.buy;
    this.screen.addComponentOrReplace(screenMat);
    
    this.makeButton('buyLeftButton', new Vector3(-1.2, 0.1, 0), new Vector3(0.3, 0.3, 1), 'l_b', 'buyLeft');
    this.makeButton('buyRightButton', new Vector3(1.2, 0.1, 0), new Vector3(0.3, 0.3, 1), 'r_b', 'buyRight');
    this.makeButton('buyButton', new Vector3(0, 0.1, -0.85), new Vector3(0.6, 0.3, 1), 'buy_b', 'actuallyBuy');
    
    this.makeButton('buyImage', new Vector3(0, 0.1, 0), new Vector3(1, 1, 1), this.buyImgs[this.buyImgIndex], 'actuallyBuy');
  }
  
  private updateBuyImg() {
    if (!this.buyImage) {
      return;
    }
    let mat = new Material();
    mat.albedoTexture = this.textures[this.buyImgs[this.buyImgIndex]];
    this.buyImage.addComponentOrReplace(mat);
  }
  
  private buyLeft() {
    this.buyImgIndex--;
    if (this.buyImgIndex < 0) {
      this.buyImgIndex = this.buyImgs.length - 1;
    }
    this.updateBuyImg();
  }
  
  private buyRight() {
    this.buyImgIndex = (this.buyImgIndex + 1) % this.buyImgs.length;
    this.updateBuyImg();
  }
  
  private actuallyBuy() {
    log('buy ' + this.buyImgs[this.buyImgIndex]);
    
    executeTask(async () => {
      try {
        await this.requirePayment('0x2b70046B540fc32d5AF3fd6B6B8c1096f7328700', 0.001, "ETH");
        log("returned (not necessarily successful)");
      }
      catch (error) {
        log("failed");
      }
    });
  }
}
