import { modifier } from 'ember-modifier';
import { findTargetElements, isChild } from '../-private/dom';

const EVENT_SOURCE_TYPE = Object.freeze({
    OUTSIDE: 'outside',
    TRIGGER: 'trigger'
});

const MODE = Object.freeze({
    TOGGLE: 'toggle',
    ADD: 'add',
    REMOVE: 'remove',
    PREVENT: 'prevent'
});

/**
 * The toggle class modifier function.
 * @param {HTMLElement} trigger - The trigger element of the toggle.
 * @param {string} positional.target - The first item of the positional parameters. The CSS selector of the target elements (e.g. '.class', '.class1.class2' or 'tag.class1.class2' etc.).
 * @param {string[]} positional.classes - The rest of the positional parameters items. HTML classes to be toggled on the target elements.
 * @param {function} [named.toggle] - A callback called before the actual class toggling. The callback receives the original event object and the information from where the event went ('outside' or 'trigger') as parameters. If the return value of the callback is false, the toggle is not performed.
 * @param {string} [named.mode] - Specifies how the modifier will work. The default behavior is toggling, but it can also just remove or add classes to the target elements. Allowable values are 'toggle' (default), 'add', 'remove' or 'prevent'. The special value "prevent" prevents toggling by the trigger element (toggling classes using the 'outside' argument will still work).
 * @param {string} [named.event-type] - Type of event whose invocation on the trigger triggers the toggle.
 * @param {boolean|object} [named.outside] - Specifies a response to an event outside the target element. If the argument is false (default), events outside the target elements are ignored. If value is true, the toggle responds to a click event originating outside the target element and toggle mode is 'remove'. Another option is a configuration hash map that specifies the response to events outside the target element.
 * @param {string} [named.outside.mode] - Specifies how events outside the target elements will work. The default behavior is removing, but it can also just toggle or add classes to the target elements. Allowable values are 'remove' (default), 'toggle' or 'add'.
 * @param {string} [named.outside.event-type] - The type of event whose invocation outside the target elements triggers the toggle.
 * @returns {function} A modifier destructor function.
 */
function toggleClass(trigger, [target, ...classes], { 'toggle': toggle, 'mode': mode = MODE.TOGGLE, 'event-type': eventType = 'click', 'outside': outside })
{
    // Validation of the mode argument.
    if (!Object.values(MODE).includes(mode)) {
        throw new Error(`Invalid toggle mode. Allowable values are '${MODE.TOGGLE}' (default), '${MODE.ADD}', '${MODE.REMOVE}' or '${MODE.PREVENT}'.`);
    }

    // Normalization of outside configuration.
    if (typeof outside === 'object') {
        outside.mode = outside.mode ?? MODE.REMOVE;
        if (!Object.values(MODE).includes(outside.mode) || outside.mode === MODE.PREVENT) {
            throw new Error(`Invalid outsidetoggle mode. Allowable values are '${MODE.REMOVE}' (default), '${MODE.TOGGLE}' or '${MODE.REMOVE}'.`);
        }
        outside.eventType = outside['event-type'] ?? 'click';
    } else {
        outside = {
            mode: outside === true? MODE.REMOVE: MODE.PREVENT,
            eventType: outside === true? 'click': null
        };
    }

    // Declarations of the trigger toggle handler.
    const triggerToggleHandler = (event) => {
        if (mode === MODE.PREVENT) {
            // This should never happen because the listener should not be assigned at all.
            return;
        }
        // Prevents toggling if modifier's toggle argument is a function and its return value is false.
        if (typeof toggle === 'function' && toggle(event, EVENT_SOURCE_TYPE.OUTSIDE) === false) {
            return;
        }
        findTargetElements(trigger, target)
            .forEach((element) => classes.forEach((item) => element.classList[mode](item)));
    };
    mode !== MODE.PREVENT && trigger.addEventListener(eventType, triggerToggleHandler);

    // Declarations of the outside toggle handler.
    const outsideToggleHandler = (event) => {
        if (outside.mode === MODE.PREVENT) {
            // This should never happen because the listener should not be assigned at all.
            return;
        }

        // Checks if the event came from outside the trigger.
        if (event.target === trigger || isChild(event.target, trigger)) {
            return;
        }

        const targetElements = findTargetElements(trigger, target);
        // Checks if the event came from outside all target elements.
        if (targetElements.some((element) => event.target === element || isChild(event.target, element))) {
            return;
        }

        // Prevents toggling if modifier's toggle argument is a function and its return value is false.
        if (typeof toggle === 'function' && toggle(event, EVENT_SOURCE_TYPE.OUTSIDE) === false) {
            return;
        }

        targetElements.forEach((element) => classes.forEach((item) => element.classList[outside.mode](item)));
    };
    outside.mode !== MODE.PREVENT && document.addEventListener(outside.eventType, outsideToggleHandler);

    return () => {
        outside.mode !== MODE.PREVENT && document.removeEventListener(outside.eventType, outsideToggleHandler);
        mode !== MODE.PREVENT && trigger.removeEventListener(eventType, triggerToggleHandler);
    };
}

const toggleClassModifier = modifier(toggleClass);

export { toggleClassModifier as default, EVENT_SOURCE_TYPE, MODE };
