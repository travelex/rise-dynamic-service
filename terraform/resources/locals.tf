locals {

  name_prefix = "${var.app_name}-${var.environment}"

  app_account_id = data.aws_caller_identity.this.account_id  

  common_tags = {
    ManagedBy           = "risk-compliance"
    SourceAccountNumber = "local.app_account_id"
    Environment         = var.target_infra
    Terraform_version   = "0.14.5"
    Email               = "aws-risk-compliance-${var.target_infra}@travelex.com"
  }

  application = "cdn"

  audit_log_table = ["audit-log-${var.environment}"]

}
