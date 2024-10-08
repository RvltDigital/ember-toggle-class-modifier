
const OUTSIDE_SELECTOR_PREFIX = 'outside:';

/**
 * Use the target selector to find the target elements. It takes the trigger element into account when searching for it.
 * @param {HTMLElement} trigger - The trigger element of the toggle.
 * @param {string} target - The CSS selector (descendant combinators are forbidden) of the target elements (e.g. '#id', '.class', '.class1.class2' or 'tag.class1.class2' etc.). Using the selector, the nearest parent element from the trigger is found. A special case is the 'self' value (the trigger element is the target element) and the 'outside:' prefix, which means that the trigger element does not have to be inside the search target elements (found target elements inside the trigger element are filtered out).
 * @returns {HTMLElement[]} Target elements found.
 */
export function findTargetElements(trigger, target)
{
    if (!(trigger instanceof HTMLElement)) {
        throw new Error('The trigger argument is not an instance of the HTMLElement.');
    }
    if (typeof target !== 'string' || /(\s|\.{2}|\.$)/.test(target)) {
        throw new Error('Invalid type or format (descendant combinators are forbidden) of the target argument.');
    }

    let elements = [];
    try {
        if (target === 'self') {
            elements = [ trigger ];
        } else if (target.startsWith(OUTSIDE_SELECTOR_PREFIX)) {
            elements = Array.from(document.querySelectorAll(target.substring(OUTSIDE_SELECTOR_PREFIX.length)))
                .filter((target) => !isChild(target, trigger));
        } else {
            const element = trigger.closest(target);
            elements = element === null? []: [ element ];
        }
    } catch (e) {
        throw new Error(`The target selector '${target}' format is invalid.`);
    }
    if (elements.length === 0) {
        throw new Error(`No elements found based on target selector '${target}'.`);
    }

    return elements;
}

/**
 * Indicates if the child element is inside of the parent element.
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @returns {boolean}
 */
export function isChild(child, parent)
{
    if (!(child instanceof HTMLElement)) {
        throw new Error('The child argument is not an instance of the HTMLElement.');
    }
    if (!(parent instanceof HTMLElement)) {
        throw new Error('The parent argument is not an instance of the HTMLElement.');
    }

    return child !== parent && parent.contains(child);
}
