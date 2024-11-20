import  { isConnected } from './dom';

/**
 * Checks whether the given argument is an single instance of the Element or an array of instances of the Element class and returns an array of unique instances.
 * @param {Element|Element[]} elements
 * @returns {Element[]}
 */
function normalizeElements(elements)
{
    if (elements instanceof Element) {
        return isConnected(elements)? [ elements ]: [];
    }
    if (!Array.isArray(elements)) {
        throw new Error('The "elements" argument must be an array of instances of the Element class.');
    }
    const _elements = [];
    for (const element of elements) {
        if (!(element instanceof Element)) {
            throw new Error('The "elements" argument contains an item that is not an instance of the Element class.');
        }
        if (!isConnected(element) || _elements.includes(element)) {
            continue;
        }
        _elements.push(element);
    }
    return _elements;
}

/**
 * Checks whether the given argument is of type string an array of non-whitespace strings and returns an array of unique values only. An argument of type string is converted to an array by trimming and whitespace splitting.
 * @param {string|string[]} classes
 * @returns {string[]}
 */
function normalizeClasses(classes)
{
    if (typeof classes === 'string') {
        classes = classes.trim().split(/\s+/);
    } else if (!Array.isArray(classes)) {
        throw new Error('The "classes" argument must be a string or an array of html class names.');
    }
    const _classes = [];
    for (const className of classes) {
        if (typeof className !== 'string' || !/^[^\s]+$/.test(className)) {
            throw new Error('The "classes" argument contains an item that is not valid class name.');
        }
        if (_classes.includes(className)) {
            continue;
        }
        _classes.push(className);
    }
    return _classes;
}

/**
 * Compares two class arrays based on values (the order of the classes does not matter).
 * @param {string[]} classes1
 * @param {string[]} classes2
 * @returns {boolean}
 */
function isEqual(classes1, classes2)
{
    return classes1.length === classes2.length && classes1.every((item) => classes2.includes(item));
}

/**
 * Returns an array of html classes parsed from the element's class attribute. If the element does not have a "class" attribute or is empty, returns an empty array.
 * @param {Element} element
 * @returns {string[]}
 */
function getClasses(element)
{
    return element.getAttribute('class')?.trim().split(/\s+/) ?? [];
}

/**
 * Performs a mutation of the "class" attribute of the element based on the given class array, if needed. If the class array is empty and the element does not have any classes, no mutation of the element is performed.
 * @param {Element} element
 * @param {string[]} classes
 * @returns {void}
 */
function setClasses(element, classes)
{
    const _classes = getClasses(element);
    if (isEqual(_classes, classes)) {
        return;
    }
    element.setAttribute('class', classes.join(' ') || null);
}

/**
 * Performs the operation of toggling the classes of the given element(s), if necessary.
 * @param {Element|Element[]} elements
 * @param {string|string[]} classes
 * @returns {void}
 */
function toggle(elements, classes)
{
    const _elements = normalizeElements(elements);
    const toggleClasses = normalizeClasses(classes);

    for (const element of _elements) {
        const oldClasses = getClasses(element);
        const newClasses = [
            ...oldClasses.filter((item) => !toggleClasses.includes(item)),
            ...toggleClasses.filter((item) => !oldClasses.includes(item))
        ];
        setClasses(element, newClasses);
    }
}

/**
 * Performs the operation of adding the classes of the given element(s), if necessary.
 * @param {Element|Element[]} elements
 * @param {string|string[]} classes
 * @returns {void}
 */
function add(elements, classes)
{
    const _elements = normalizeElements(elements);
    const addClasses = normalizeClasses(classes);
    for (const element of _elements) {
        const oldClasses = getClasses(element);
        const newClasses = [
            ...oldClasses,
            ...addClasses.filter((item) => !oldClasses.includes(item))
        ];
        setClasses(element, newClasses);
    }
}

/**
 * Performs the operation of removing the classes of the given element(s), if necessary.
 * @param {Element|Element[]} elements
 * @param {string|string[]} classes
 * @returns {void}
 */
function remove(elements, classes)
{
    const _elements = normalizeElements(elements);
    const removeClasses = normalizeClasses(classes);
    for (const element of _elements) {
        const oldClasses = getClasses(element);
        const newClasses = oldClasses.filter((item) => !removeClasses.includes(item));
        setClasses(element, newClasses);
    }
}

export { toggle, add, remove };
