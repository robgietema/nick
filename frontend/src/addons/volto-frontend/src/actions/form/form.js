/**
 * Update form data function.
 * @function updateFormData
 * @param {Object} data New form data.
 * @returns {Object} Updated form data action.
 */
export function updateFormData(data) {
  return {
    type: 'UPDATE_FORM_DATA',
    data,
  };
}
