import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PowerDynCustomLabel implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	// Init local variables
	private _labelElement: HTMLLabelElement;
	private _textElement: HTMLInputElement;
	private _brElement: HTMLBRElement;
	private _container: HTMLDivElement;
	private _fieldName: string;

	//Reference to Componenent Framework context
	private _context: ComponentFramework.Context<IInputs>;	

	/**
	 * Event Variable
	 */
	private _fieldChanged: EventListenerOrEventListenerObject;
	private _notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		//Used as part of the random value for the ID. 
		const randomValueIdArray = new Uint32Array(1);

		// Add control initialization code		
		this._context = context; //set context
		this._notifyOutputChanged = notifyOutputChanged;
		this._container = container; //set the container	 
		
		//register eventhandler functions
		this._fieldChanged = this.fieldChanged.bind(this);	

		//label element
		this._labelElement = document.createElement("label"); //creates the label element
		this._labelElement.id = "powerDynCustomLabel_" + crypto.getRandomValues(randomValueIdArray); 
		this._labelElement.setAttribute("id", "powerDynCustomLabel_"); //Set the id 
		this._labelElement.innerHTML = "NA"; //Set NA as default
		
		//br element
		this._brElement = document.createElement("br");

		//Text Input element
		this._textElement = document.createElement("input");
		this._textElement.setAttribute("id", "txtInput");
		this._textElement.addEventListener("change", this._fieldChanged);
		
		
		//Add elements to the container
		this._container.appendChild(this._labelElement); //add the label to the div
		this._container.appendChild(this._brElement);
		this._container.appendChild(this._textElement);	
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view		
		this._context = context;		
		
		//Set the label text to the input from the config
		this._labelElement.innerHTML = this._context.parameters.customLabelProperty.raw!;	
		
		/**
		 * Check if the field has data in it already.CRM attributes bound to the control properties.
     	*/	

        // @ts-ignore
        this._fieldName = this._context.parameters.fieldNameProperty.attributes.LogicalName
		// @ts-ignore 
        var crmFieldStringsAttributeValue = Xrm.Page.getAttribute(this._fieldName).getValue();
		// @ts-ignore		
		this._textElement.value = crmFieldStringsAttributeValue;       
		
        // Used for when the field actually changes.
        // @ts-ignore
		Xrm.Page.getAttribute(this._fieldName).setValue(this._context.parameters.fieldNameProperty);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			fieldNameProperty: this._textElement.value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		this._textElement.removeEventListener("change", this._fieldChanged);
	}

	 // event handlers
	 public fieldChanged(evt: Event): void {        		
		// this will call the getOutputs method.
        this._notifyOutputChanged();        
    }
}