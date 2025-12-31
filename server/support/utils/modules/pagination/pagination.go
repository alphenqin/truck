package pagination

// PaginationUtil provides pagination utility functions
type PaginationUtil struct{}

// ValidatePagination validates and normalizes pagination parameters
// Returns validated limit and offset values
func (p *PaginationUtil) ValidatePagination(limit, offset int) (int, int) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	if offset < 0 {
		offset = 0
	}

	return limit, offset
}

// ValidatePaginationParams validates pagination parameters from struct fields
// Handles both direct int fields and pointer int fields
func (p *PaginationUtil) ValidatePaginationParams(limit, offset interface{}) (int, int) {
	limitValue := 0
	offsetValue := 0

	// Handle different types of limit/offset fields
	switch l := limit.(type) {
	case int:
		limitValue = l
	case *int:
		if l != nil {
			limitValue = *l
		}
	}

	switch o := offset.(type) {
	case int:
		offsetValue = o
	case *int:
		if o != nil {
			offsetValue = *o
		}
	}

	return p.ValidatePagination(limitValue, offsetValue)
}

// ValidatePagination validates and normalizes pagination parameters
// Returns validated limit and offset values
// This is a standalone function for backward compatibility
func ValidatePagination(limit, offset int) (int, int) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	if offset < 0 {
		offset = 0
	}

	return limit, offset
}

// ValidatePaginationParams validates pagination parameters from struct fields
// Handles both direct int fields and pointer int fields
// This is a standalone function for backward compatibility
func ValidatePaginationParams(limit, offset interface{}) (int, int) {
	limitValue := 0
	offsetValue := 0

	// Handle different types of limit/offset fields
	switch l := limit.(type) {
	case int:
		limitValue = l
	case *int:
		if l != nil {
			limitValue = *l
		}
	}

	switch o := offset.(type) {
	case int:
		offsetValue = o
	case *int:
		if o != nil {
			offsetValue = *o
		}
	}

	return ValidatePagination(limitValue, offsetValue)
}