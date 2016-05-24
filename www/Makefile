MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
include $(MAKEFILE_DIR)../../Admin/Makefile.shared

install:
	$(BOWER) install 
	composer --verbose install

