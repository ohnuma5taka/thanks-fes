#!/bin/bash

output=""

# .envファイルを1行ずつ読み込み
while IFS= read -r line
do
  if [[ "$line" =~ ^# ]] || [[ -z "$line" ]]; then continue; fi
  key=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)

  output+="--build-arg $key=$value "
done < .env

echo "$output"
