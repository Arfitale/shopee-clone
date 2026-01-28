<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";

  import {
    ArrowLeft,
    Package,
    Truck,
    CircleCheck
  } from "@lucide/svelte";
</script>


<div class="min-h-screen bg-secondary p-6">
  <!-- Top Nav -->
  <nav class="mb-6">
    <a
      href="/dashboard/products"
      class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
    >
      <ArrowLeft class="h-4 w-4" />
      Back to products
    </a>
  </nav>

  <div class="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar Stepper -->
    <Card class="md:col-span-1">
      <CardContent class="p-4">
        <nav class="space-y-2">

          <!-- Step 1 -->
          <div class="flex items-center gap-3 rounded-lg px-3 py-2 bg-accent text-primary font-medium">
            <div class="h-6 w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Package class="h-3 w-3" />
            </div>
            Product details
          </div>

          <!-- Step 2 -->
          <div class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
            <div class="h-6 w-6 flex items-center justify-center rounded-full border">
              <Truck class="h-3 w-3" />
            </div>
            Shipment options
          </div>

          <!-- Step 3 -->
          <div class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
            <div class="h-6 w-6 flex items-center justify-center rounded-full border">
              <CircleCheck class="h-3 w-3" />
            </div>
            Review & publish
          </div>

        </nav>
      </CardContent>
    </Card>

    <!-- Main Form -->
    <Card class="md:col-span-3">
      <CardContent class="p-8 space-y-6">

        <!-- Header -->
        <div>
          <h1 class="text-2xl font-semibold text-foreground">
            Product details
          </h1>
          <p class="text-sm text-muted-foreground">
            Tell buyers about your product
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-6" method="POST">

          <!-- Product Name -->
          <div class="space-y-2">
            <label class="text-sm font-medium">
              Product name
              <Input
              placeholder="e.g. Mechanical Keyboard"
              required
              minlength={3}
              />
            </label>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="text-sm font-medium">
              Description
              <span class="text-xs text-muted-foreground">(optional)</span>
              <Textarea
              rows={4}
              placeholder="Describe your product in detail..."
              />
            </label>
          </div>

          <!-- Price & Stock -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Price
                
                <Input
                type="number"
                min={0}
                placeholder="100000"
                required
                />
              </label>
              </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Stock
                
                <Input
                type="number"
                min="0"
                placeholder="10"
                />
              </label>
              </div>
          </div>

          <Separator />

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <Button class="bg-primary hover:bg-primary-hover text-primary-foreground" type="submit">
              Save & Continue →
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>

  </div>
</div>
