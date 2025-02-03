#!/bin/bash

# Frontend scripts
pnpm --filter frontend types
pnpm --filter frontend lint
pnpm --filter frontend format

# Backend scripts
pnpm --filter backend types
pnpm --filter backend lint
pnpm --filter backend format
