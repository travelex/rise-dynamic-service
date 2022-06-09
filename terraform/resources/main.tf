##########Process-Excellence#########
provider "aws" {
  region = var.target_region
  
}

provider "tls" {}

terraform {
  backend "s3" {
  }
}

provider "template" {
  
}

data "aws_caller_identity" "this" {}


##########Audit_Log_Table############
resource "aws_dynamodb_table" "audit_log_table" {
  count         = length(local.audit_log_table)
  name         = "${local.audit_log_table[count.index]}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "transactionId"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "transactionId"
    type = "S"
  }

  ttl {
    attribute_name = "expiry"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }

  tags = "${merge(
    local.common_tags,
    map(
      "Name", "${local.audit_log_table[count.index]}",
    )
  )}"
}
