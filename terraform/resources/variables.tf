
variable "target_region" {
  description = "AWS Region to use whilst provisioning this infrastructure"
  type        = string
}

variable "target_infra" {
  description = "AWS Target Infrastructure (prod or nonprod)"
  type        = string
}

variable "environment" {
  description = "Application parent/category"
  type        = string
}

variable "app_name" {
  description = "Application Name"
  type        = string
}

variable "app_parent" {
  description = "Stage (e.g. `Retail`)"
  default     = "tvx"
}

variable "organisation" {
  type    = string
  default = "tvx"
}