MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

BACKUP_FILE  := angular-tools.tar
SEAFILE_FILE := angular-tools.tar

include $(MAKEFILE_DIR)/../Admin/Makefile.shared
include $(MAKEFILE_DIR)/../Admin/rules.mk


backup:
	tar zcvf - . > "$(DIR_BACKUP)/$(BACKUP_FILE)"

to-seafile:
	$(MAKE) backup
	rm -f "$(DIR_SEAFILE)/$(SEAFILE_FILE)"
	cp "$(DIR_BACKUP)/$(BACKUP_FILE)" "$(DIR_SEAFILE)/$(SEAFILE_FILE)"

update:
	svn up


