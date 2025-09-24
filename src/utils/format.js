export const formartValidationError = (errors) => {
    if(!errors || !errors.issue)
        return "Validation failed";

    if (Array.isArray(errors.issues))
        return errors.issue.map(i => i.message).join(', ');

    return JSON.stringify(errors);
}