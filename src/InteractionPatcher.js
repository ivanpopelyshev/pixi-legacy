export default function InteractionPatcherV3(PIXI) {

	function processInteractiveV3(point, displayObject, func, hitTest, interactive)
	{
		if(!displayObject || !displayObject.visible)
		{
			return false;
		}

		// Took a little while to rework this function correctly! But now it is done and nice and optimised. ^_^
		//
		// This function will now loop through all objects and then only hit test the objects it HAS to, not all of them. MUCH faster..
		// An object will be hit test if the following is true:
		//
		// 1: It is interactive.
		// 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
		//
		// As another little optimisation once an interactive object has been hit we can carry on through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
		// A final optimisation is that an object is not hit test directly if a child has already been hit.

		var hit = false,
			interactiveParent = interactive = displayObject.interactive || interactive;

		// if the displayobject has a hitArea, then it does not need to hitTest children.
		if (displayObject.hitArea)
		{
			interactiveParent = false;
		}
		// it has a mask! Then lets hit test that before continuing
		else if (hitTest && displayObject._mask)
		{
			if (!displayObject._mask.containsPoint(point))
			{
				hitTest = false;
			}
		}

		// ** FREE TIP **! If an object is not interacttive or has no buttons in it (such as a game scene!) set interactiveChildren to false for that displayObject.
		// This will allow pixi to completly ignore and bypass checking the displayObjects children.
		if(displayObject.interactiveChildren)
		{
			var children = displayObject.children;

			for (var i = children.length-1; i >= 0; i--)
			{
				var child = children[i];

				// time to get recursive.. if this function will return if somthing is hit..
				if(this.processInteractive(point, child, func, hitTest, interactiveParent))
				{
					// its a good idea to check if a child has lost its parent.
					// this means it has been removed whilst looping so its best
					if(!child.parent)
					{
						continue;
					}

					hit = true;

					// we no longer need to hit test any more objects in this container as we we now know the parent has been hit
					interactiveParent = false;

					// If the child is interactive , that means that the object hit was actually interactive and not just the child of an interactive object.
					// This means we no longer need to hit test anything else. We still need to run through all objects, but we don't need to perform any hit tests.
					//if(child.interactive)
					//{
					hitTest = false;
					//}

					// we can break now as we have hit an object.
					//break;
				}
			}
		}

		// no point running this if the item is not interactive or does not have an interactive parent.
		if(interactive)
		{
			// if we are hit testing (as in we have no hit any objects yet)
			// We also don't need to worry about hit testing if once of the displayObjects children has already been hit!
			if(hitTest && !hit)
			{
				if(displayObject.hitArea)
				{
					displayObject.worldTransform.applyInverse(point,  this._tempPoint);
					hit = displayObject.hitArea.contains( this._tempPoint.x, this._tempPoint.y );
				}
				else if(displayObject.containsPoint)
				{
					hit = displayObject.containsPoint(point);
				}
			}

			if(displayObject.interactive)
			{
				func(displayObject, hit);
			}
		}

		return hit;

	}

	PIXI.InteractionManager.prototype.processInteractive = processInteractiveV3;
}
